import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  symlink,
  truncate,
  writeFile,
} from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { createProject } from "../src/core/project";
import {
  workspaceMediaUrl,
  type WorkspaceListing,
} from "../src/core/workspace";
import { devRequestRejection, HttpError } from "../src/host/http";
import { resolveStudioConfig, StudioRuntime } from "../src/host/runtime";
import { StudioStore } from "../src/host/storage";
import { sessionWorkspace, WorkspaceFiles } from "../src/host/workspace";
import type { Asset, Project } from "../src/types";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
  "base64",
);
const sessionId = "workspace-session-a";
const signal = () => AbortSignal.timeout(5_000);
const hasStatus = (status: number) => (error: unknown) =>
  error instanceof HttpError && error.status === status;

async function directory(t: TestContext) {
  const root = await realpath(
    await mkdtemp(join(tmpdir(), "studio-workspace-")),
  );
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

async function fixture(t: TestContext, maxUploadBytes = PNG.length + 16) {
  const root = await directory(t);
  const workspace = join(root, "workspace");
  const otherWorkspace = join(root, "workspace-archive");
  await Promise.all([mkdir(workspace), mkdir(otherWorkspace)]);
  let port = 0;
  const runtime = new StudioRuntime({
    config: { dataDir: join(root, "data"), maxUploadBytes },
    studioDir: join(root, "studio"),
    remotionDir: join(root, "remotion"),
    authorize: (req) => devRequestRejection(req, port),
    resolveWorkspace: async (id) =>
      id === sessionId || id === "workspace-session-b"
        ? workspace
        : id === "other-session"
          ? otherWorkspace
          : undefined,
  });
  await runtime.init();
  const server = createServer(runtime.handle);
  t.after(async () => {
    await runtime.dispose();
    const closed = new Promise<void>((done) => server.close(() => done()));
    server.closeAllConnections();
    await closed;
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  port = (server.address() as AddressInfo).port;
  const origin = `http://127.0.0.1:${port}`;
  return {
    root,
    workspace,
    otherWorkspace,
    runtime,
    request: (path: string, init?: RequestInit) =>
      fetch(`${origin}/video-studio${path}`, { ...init, signal: signal() }),
  };
}

test("session workspace uses exact registry membership before live and cold headers without reading messages", async () => {
  const calls: string[] = [];
  const requestSignal = signal();
  const sessions = {
    get(id: string) {
      calls.push(`live:${id}`);
      return id === sessionId
        ? {
            header: { cwd: "/live/workspace" },
            get events(): never {
              throw new Error("Session messages must not be read");
            },
          }
        : undefined;
    },
  };
  const persistence = {
    async list(receivedSignal?: AbortSignal) {
      assert.equal(receivedSignal, requestSignal);
      calls.push("cold:list");
      return [
        { id: "cold-session-prefix", cwd: "/wrong/prefix" },
        { id: "cold-session", cwd: "/cold/workspace" },
      ];
    },
    inspect(): never {
      throw new Error("Persisted messages must not be read");
    },
  };
  const workspaces = {
    list: () => [
      { path: "/wrong/prefix", sessionIds: [`${sessionId}-prefix`] },
      { path: "/registry/workspace", sessionIds: [sessionId] },
    ],
  };
  assert.equal(
    await sessionWorkspace(
      sessionId,
      requestSignal,
      sessions,
      persistence,
      workspaces,
    ),
    "/registry/workspace",
  );
  assert.deepEqual(calls, []);
  assert.equal(
    await sessionWorkspace(sessionId, requestSignal, sessions, persistence),
    "/live/workspace",
  );
  assert.deepEqual(calls.splice(0), [`live:${sessionId}`]);
  assert.equal(
    await sessionWorkspace(
      "cold-session",
      requestSignal,
      sessions,
      persistence,
      workspaces,
    ),
    "/cold/workspace",
  );
  assert.deepEqual(calls.splice(0), ["live:cold-session", "cold:list"]);
  assert.equal(
    await sessionWorkspace(
      "missing-session",
      requestSignal,
      sessions,
      persistence,
    ),
    undefined,
  );
  calls.length = 0;
  await assert.rejects(
    sessionWorkspace("../session", requestSignal, sessions, persistence),
    hasStatus(400),
  );
  await assert.rejects(
    sessionWorkspace(
      sessionId,
      AbortSignal.abort(),
      sessions,
      persistence,
      workspaces,
    ),
    { name: "AbortError" },
  );
  assert.deepEqual(calls, []);
});

test("workspace roots validate session IDs, availability and canonical directory identity", async (t) => {
  const root = await directory(t);
  const workspace = join(root, "workspace");
  const alias = join(root, "workspace-alias");
  const file = join(root, "frame.png");
  await mkdir(workspace);
  await symlink(workspace, alias);
  await writeFile(file, PNG);
  const files = new WorkspaceFiles(async (id) =>
    id === sessionId ? alias : id === "file-session" ? file : undefined,
  );
  assert.equal(await files.root(sessionId, signal()), workspace);
  for (const id of ["", "../escape", "session/id", "a".repeat(101)])
    await assert.rejects(files.root(id, signal()), hasStatus(400));
  await assert.rejects(files.root("missing", signal()), hasStatus(404));
  await assert.rejects(files.root("file-session", signal()), hasStatus(404));
  await assert.rejects(
    new WorkspaceFiles().root(sessionId, signal()),
    hasStatus(503),
  );
  await assert.rejects(files.root(sessionId, AbortSignal.abort()), {
    name: "AbortError",
  });
});

test("workspace navigation excludes generated, hidden and linked files and rejects path escapes", async (t) => {
  const root = await directory(t);
  const workspace = join(root, "workspace");
  const outside = join(root, "outside");
  await Promise.all([
    mkdir(join(workspace, "shots", "take 01"), { recursive: true }),
    mkdir(outside),
  ]);
  const excluded = [
    ".git",
    ".cache",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "target",
    "vendor",
  ];
  await Promise.all(
    excluded.map(async (name) => {
      await mkdir(join(workspace, name));
      await writeFile(join(workspace, name, "hidden.png"), PNG);
    }),
  );
  await Promise.all([
    writeFile(join(workspace, "frame.png"), PNG),
    writeFile(join(workspace, ".hidden.png"), PNG),
    writeFile(join(workspace, "notes.txt"), "not media"),
    writeFile(join(workspace, "shots", "take 01", "画面 #1.png"), PNG),
    writeFile(join(outside, "private.png"), PNG),
    writeFile(
      join(workspace, "package.json"),
      JSON.stringify({
        name: "fixture-composition",
        devDependencies: { "@remotion/cli": "0.0.0" },
      }),
    ),
    symlink(outside, join(workspace, "linked-directory")),
    symlink(join(outside, "private.png"), join(workspace, "linked.png")),
    symlink(join(workspace, "frame.png"), join(workspace, "internal-link.png")),
  ]);
  const files = new WorkspaceFiles(async () => workspace);
  const listing = await files.list(sessionId, "", signal());
  assert.equal(listing.workspacePath, workspace);
  assert.equal(listing.workspaceName, basename(workspace));
  assert.equal(listing.parentPath, null);
  assert.equal(listing.truncated, false);
  assert.deepEqual(
    listing.entries.map(({ name }) => name),
    ["shots", "frame.png"],
  );
  assert.deepEqual(listing.remotion, { packageName: "fixture-composition" });
  const nested = await files.list(sessionId, "shots/take 01", signal());
  assert.equal(nested.path, "shots/take 01");
  assert.equal(nested.parentPath, "shots");
  assert.equal(nested.entries[0]?.path, "shots/take 01/画面 #1.png");
  assert.equal(nested.entries[0]?.size, PNG.length);
  assert.ok(Number.isFinite(Date.parse(nested.entries[0]!.modifiedAt!)));
  assert.equal((await files.list(sessionId, "shots", signal())).parentPath, "");
  for (const path of [
    "../outside",
    "shots/../frame.png",
    "shots//take 01",
    "./frame.png",
    ".cache",
    "node_modules",
    "linked-directory",
    "linked.png",
    "internal-link.png",
  ])
    await assert.rejects(
      files.list(sessionId, path, signal()),
      hasStatus(403),
      path,
    );
  for (const path of [outside, "shots\\take 01", "bad\0path", "a".repeat(4097)])
    await assert.rejects(
      files.list(sessionId, path, signal()),
      hasStatus(400),
      path,
    );
  await assert.rejects(
    files.list(sessionId, "frame.png", signal()),
    hasStatus(400),
  );
  await assert.rejects(
    files.media(sessionId, "notes.txt", signal()),
    hasStatus(415),
  );
  await assert.rejects(
    files.media(sessionId, "linked-directory/private.png", signal()),
    hasStatus(403),
  );
  await assert.rejects(
    files.media(sessionId, "internal-link.png", signal()),
    hasStatus(403),
  );
});

test("workspace directory listings cap results at 200 and mark truncation", async (t) => {
  const root = await directory(t);
  await Promise.all(
    Array.from({ length: 205 }, (_, index) =>
      writeFile(join(root, `frame-${index}.png`), PNG),
    ),
  );
  const listing = await new WorkspaceFiles(async () => root).list(
    sessionId,
    "",
    signal(),
  );
  assert.equal(listing.entries.length, 200);
  assert.equal(listing.truncated, true);
  assert.equal(new Set(listing.entries.map(({ path }) => path)).size, 200);
});

test("workspace HTTP listing and media preserve path encoding, HEAD and byte Range semantics", async (t) => {
  const app = await fixture(t);
  const path = "画面 #1.png";
  await writeFile(join(app.workspace, path), PNG);
  const listing = await app.request(
    `/api/workspace?${new URLSearchParams({ sessionId })}`,
  );
  assert.equal(listing.status, 200);
  assert.equal(listing.headers.get("cache-control"), "no-store");
  const body = (await listing.json()) as WorkspaceListing;
  assert.equal(body.sessionId, sessionId);
  assert.equal(body.workspacePath, app.workspace);
  assert.equal(body.entries[0]?.path, path);
  const url = workspaceMediaUrl(sessionId, path).slice("/video-studio".length);
  const response = await app.request(url);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), PNG);
  const range = await app.request(url, { headers: { Range: "bytes=2-7" } });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get("content-range"), `bytes 2-7/${PNG.length}`);
  assert.deepEqual(Buffer.from(await range.arrayBuffer()), PNG.subarray(2, 8));
  const head = await app.request(url, {
    method: "HEAD",
    headers: { Range: "bytes=2-7" },
  });
  assert.equal(head.status, 206);
  assert.equal(head.headers.get("content-length"), "6");
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  const invalidRange = await app.request(url, {
    headers: { Range: `bytes=${PNG.length}-` },
  });
  assert.equal(invalidRange.status, 416);
  assert.equal(
    invalidRange.headers.get("content-range"),
    `bytes */${PNG.length}`,
  );
  assert.equal((await app.request("/api/workspace")).status, 400);
  assert.equal(
    (await app.request("/api/workspace?sessionId=missing")).status,
    404,
  );
  assert.equal(
    (
      await app.request(
        `/api/workspace?${new URLSearchParams({ sessionId, path: "../workspace-archive" })}`,
      )
    ).status,
    403,
  );
});

test("workspace import copies only the selected media and leaves original bytes and metadata intact", async (t) => {
  const app = await fixture(t);
  const path = "chosen.png";
  const source = join(app.workspace, path);
  await Promise.all([
    writeFile(source, PNG),
    writeFile(join(app.workspace, "unselected.png"), PNG),
  ]);
  const before = await stat(source);
  const response = await app.request("/api/workspace/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, path, duration: 5, width: 1, height: 1 }),
  });
  assert.equal(response.status, 201);
  const asset = (await response.json()) as Asset;
  assert.equal(asset.name, path);
  assert.equal(asset.kind, "image");
  assert.equal(asset.duration, 5);
  assert.equal(asset.src, `/video-studio/media/${asset.id}`);
  const stored = await app.runtime.store.asset(asset.id);
  assert.notEqual(stored.file, source);
  assert.notEqual((await stat(stored.file)).ino, before.ino);
  assert.deepEqual(await readFile(stored.file), PNG);
  assert.deepEqual(await readFile(source), PNG);
  const after = await stat(source);
  assert.equal(after.ino, before.ino);
  assert.equal(after.mtimeMs, before.mtimeMs);
  assert.deepEqual(
    (await readdir(join(app.root, "data/assets"))).sort(),
    [`${asset.id}.json`, `${asset.id}.png`].sort(),
  );
  assert.deepEqual((await readdir(app.workspace)).sort(), [
    path,
    "unselected.png",
  ]);
});

test("workspace import rejects oversized files and invalid metadata without retaining assets", async (t) => {
  const app = await fixture(t, PNG.length);
  await Promise.all([
    writeFile(join(app.workspace, "valid.png"), PNG),
    writeFile(join(app.workspace, "large.png"), Buffer.alloc(PNG.length + 1)),
    writeFile(join(app.workspace, "empty.png"), Buffer.alloc(0)),
  ]);
  const post = (body: unknown) =>
    app.request("/api/workspace/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  const valid = { sessionId, path: "valid.png", duration: 5 };
  assert.equal((await post({ ...valid, path: "large.png" })).status, 413);
  assert.equal((await post({ ...valid, path: "empty.png" })).status, 400);
  for (const body of [
    { ...valid, duration: 0 },
    { ...valid, duration: 3601 },
    { ...valid, duration: "5" },
    { ...valid, duration: undefined },
    { ...valid, width: -1 },
    { ...valid, height: 0 },
    { ...valid, path: "" },
    { ...valid, workspacePath: app.otherWorkspace },
  ])
    assert.equal((await post(body)).status, 400, JSON.stringify(body));
  assert.equal(
    (await post({ ...valid, path: "../workspace-archive/file.png" })).status,
    403,
  );
  assert.deepEqual(await readdir(join(app.root, "data/assets")), []);
  assert.deepEqual(await readFile(join(app.workspace, "valid.png")), PNG);
  assert.equal(
    (await stat(join(app.workspace, "large.png"))).size,
    PNG.length + 1,
  );
});

test("cancelling an import after its first source read removes every partial asset", async (t) => {
  const root = await directory(t);
  const source = join(root, "large.mp4");
  await writeFile(source, PNG);
  await truncate(source, 8 * 1024 * 1024);
  const before = await stat(source);
  const store = new StudioStore(join(root, "data"));
  await store.init();
  t.after(() => store.dispose());
  const controller = new AbortController();
  let firstReadBytes = 0;
  const upload = store.upload.bind(store);
  store.upload = async (stream, query, requestSignal, maxBytes) => {
    assert.equal(requestSignal.aborted, false);
    const iterator = stream.iterator.bind(stream);
    // The upload has opened its temporary file before it requests this iterator.
    stream.iterator = (options) => {
      const reader = iterator(options);
      const next = reader.next.bind(reader);
      reader.next = async (...args) => {
        const item = await next(...args);
        if (!item.done && firstReadBytes === 0) {
          firstReadBytes = Buffer.byteLength(item.value);
          controller.abort();
        }
        return item;
      };
      return reader;
    };
    return upload(stream, query, requestSignal, maxBytes);
  };
  await assert.rejects(
    store.importFile(
      source,
      new URLSearchParams({ name: "large.mp4", kind: "video", duration: "10" }),
      controller.signal,
    ),
    /abort|cancel/i,
  );
  assert.ok(
    firstReadBytes > 0,
    "Cancellation must happen after a real source read",
  );
  assert.equal(controller.signal.aborted, true);
  assert.deepEqual(await readdir(join(root, "data/assets")), []);
  const after = await stat(source);
  assert.equal(after.size, before.size);
  assert.equal(after.mtimeMs, before.mtimeMs);
});

test("workspace imports reject an asset directory replaced by a symlink without writing outside storage", async (t) => {
  const root = await directory(t);
  const source = join(root, "frame.png");
  const outside = join(root, "outside");
  await Promise.all([writeFile(source, PNG), mkdir(outside)]);
  const store = new StudioStore(join(root, "data"));
  await store.init();
  t.after(() => store.dispose());
  const assets = join(root, "data/assets");
  const originalAssets = join(root, "data/assets-original");
  await rename(assets, originalAssets);
  await symlink(outside, assets);
  await assert.rejects(
    store.importFile(
      source,
      new URLSearchParams({ name: "frame.png", kind: "image", duration: "5" }),
      signal(),
    ),
    hasStatus(403),
  );
  assert.deepEqual(await readdir(outside), []);
  assert.deepEqual(await readdir(originalAssets), []);
  assert.deepEqual(await readFile(source), PNG);
});

test("project HTTP filters require the same canonical workspace and exact session scope", async (t) => {
  const app = await fixture(t);
  const alias = join(app.root, "workspace-alias");
  const nested = join(app.workspace, "nested");
  await Promise.all([symlink(app.workspace, alias), mkdir(nested)]);
  const make = (
    name: string,
    workspacePath?: string,
    id = sessionId,
  ): Project => ({
    ...createProject(),
    name,
    ...(workspacePath ? { dsh: { workspacePath, sessionId: id } } : {}),
  });
  const projects = [
    make("session direct", app.workspace),
    make("session canonical alias", alias),
    make("same workspace other session", app.workspace, "workspace-session-b"),
    make("same workspace session prefix", app.workspace, `${sessionId}-prefix`),
    make("sibling workspace prefix", app.otherWorkspace),
    make("nested workspace", nested),
    make("missing workspace", join(app.root, "missing")),
    make("unbound"),
  ];
  await Promise.all(
    projects.map((project) =>
      app.runtime.store.saveProject(project.id, project),
    ),
  );
  const names = async (scope?: string) => {
    const query = new URLSearchParams({
      sessionId,
      ...(scope ? { scope } : {}),
    });
    const response = await app.request(`/api/projects?${query}`);
    assert.equal(response.status, 200);
    return ((await response.json()) as Project[])
      .map(({ name }) => name)
      .sort();
  };
  assert.deepEqual(await names(), [
    "session canonical alias",
    "session direct",
  ]);
  assert.deepEqual(await names("session"), [
    "session canonical alias",
    "session direct",
  ]);
  assert.deepEqual(await names("workspace"), [
    "same workspace other session",
    "same workspace session prefix",
    "session canonical alias",
    "session direct",
  ]);
  assert.equal(
    (await app.request(`/api/projects?sessionId=${sessionId}&scope=all`))
      .status,
    400,
  );
  assert.equal(
    (await app.request("/api/projects?sessionId=missing&scope=workspace"))
      .status,
    404,
  );
});

test("default studio storage follows DSH_HOME while explicit paths retain precedence", () => {
  assert.equal(
    resolveStudioConfig({}, {}).dataDir,
    join(homedir(), ".dsh/video-studio"),
  );
  assert.equal(
    resolveStudioConfig({}, { DSH_HOME: "/isolated/dsh" }).dataDir,
    "/isolated/dsh/video-studio",
  );
  assert.notEqual(
    resolveStudioConfig({}, { DSH_HOME: "/isolated/a" }).dataDir,
    resolveStudioConfig({}, { DSH_HOME: "/isolated/b" }).dataDir,
  );
  assert.equal(
    resolveStudioConfig({}, { DSH_HOME: "relative-home" }).dataDir,
    resolve("relative-home/video-studio"),
  );
  assert.equal(
    resolveStudioConfig(
      {},
      { DSH_HOME: "/isolated/dsh", DSH_VIDEO_DATA_DIR: "/explicit/env" },
    ).dataDir,
    "/explicit/env",
  );
  assert.equal(
    resolveStudioConfig(
      { dataDir: "/explicit/config" },
      { DSH_VIDEO_DATA_DIR: "/explicit/env" },
    ).dataDir,
    "/explicit/config",
  );
});
