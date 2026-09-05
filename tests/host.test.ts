import test from "node:test";
import assert from "node:assert/strict";
import { createServer, request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rm,
  unlink,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createProject } from "../src/core/project";
import type { Asset, Project } from "../src/types";
import { StudioRuntime } from "../src/host/runtime";
import { JobQueue } from "../src/host/jobs";
import { AsrRegistry, openAiAsrProvider, parseSegments } from "../src/host/asr";
import { createRenderMediaServer } from "../src/host/render";
import { devRequestRejection } from "../src/host/http";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
  "base64",
);

async function fixture(
  options: { maxUploadBytes?: number; auth?: boolean } = {},
) {
  const root = await mkdtemp(join(tmpdir(), "video-studio-host-"));
  await mkdir(join(root, "studio"));
  await writeFile(join(root, "studio/index.html"), "<html>Video Studio</html>");
  let port = 0;
  const runtime = new StudioRuntime({
    config: {
      dataDir: join(root, "data"),
      ...(options.maxUploadBytes
        ? { maxUploadBytes: options.maxUploadBytes }
        : {}),
    },
    studioDir: join(root, "studio"),
    remotionDir: join(root, "remotion"),
    authorize: (req) =>
      options.auth
        ? req.headers.cookie === "test-session=valid"
          ? undefined
          : 401
        : devRequestRejection(req, port),
  });
  await runtime.init();
  const server = createServer(runtime.handle);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = (server.address() as AddressInfo).port;
  const origin = `http://127.0.0.1:${port}`;
  return {
    root,
    runtime,
    port,
    origin,
    async close() {
      await runtime.dispose();
      const closed = new Promise<void>((resolve) =>
        server.close(() => resolve()),
      );
      server.closeAllConnections();
      await closed;
      await rm(root, { recursive: true, force: true });
    },
  };
}

async function upload(origin: string, body: Buffer = PNG): Promise<Asset> {
  const response = await fetch(
    `${origin}/video-studio/api/assets?name=frame.png&kind=image&duration=5&width=1&height=1`,
    { method: "POST", body: new Uint8Array(body).buffer },
  );
  assert.equal(response.status, 201);
  return (await response.json()) as Asset;
}

test("host protects index, API, media and exports before dispatch", async () => {
  const app = await fixture({ auth: true });
  try {
    for (const path of [
      "",
      "api/capabilities",
      "media/missing",
      "exports/missing.mp4",
    ])
      assert.equal(
        (await fetch(`${app.origin}/video-studio/${path}`)).status,
        401,
      );
    const valid = await fetch(`${app.origin}/video-studio/`, {
      headers: { Cookie: "test-session=valid" },
    });
    assert.equal(valid.status, 200);
    assert.match(await valid.text(), /Video Studio/);
  } finally {
    await app.close();
  }
});

test("developer server rejects foreign Origin, fetch site and Host", async () => {
  const app = await fixture();
  try {
    assert.equal(
      (
        await fetch(`${app.origin}/video-studio/api/capabilities`, {
          headers: { Origin: "https://example.com" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(`${app.origin}/video-studio/api/capabilities`, {
          headers: { "Sec-Fetch-Site": "cross-site" },
        })
      ).status,
      403,
    );
    const status = await new Promise<number | undefined>((resolve, reject) => {
      const req = httpRequest(
        `${app.origin}/video-studio/`,
        { headers: { Host: "attacker.example" } },
        (res) => {
          res.resume();
          resolve(res.statusCode);
        },
      );
      req.on("error", reject);
      req.end();
    });
    assert.equal(status, 403);
  } finally {
    await app.close();
  }
});

test("uploaded media is durable, supports HEAD and precise byte ranges, and rejects traversal", async () => {
  const app = await fixture();
  try {
    const asset = await upload(app.origin);
    assert.equal(asset.kind, "image");
    assert.equal(asset.src, `/video-studio/media/${asset.id}`);
    const range = await fetch(app.origin + asset.src, {
      headers: { Range: "bytes=0-7" },
    });
    assert.equal(range.status, 206);
    assert.equal(range.headers.get("content-range"), `bytes 0-7/${PNG.length}`);
    assert.deepEqual(
      Buffer.from(await range.arrayBuffer()),
      PNG.subarray(0, 8),
    );
    const suffix = await fetch(app.origin + asset.src, {
      headers: { Range: "bytes=-3" },
    });
    assert.deepEqual(Buffer.from(await suffix.arrayBuffer()), PNG.subarray(-3));
    const head = await fetch(app.origin + asset.src, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("content-length"), String(PNG.length));
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    assert.equal(
      (
        await fetch(app.origin + asset.src, {
          headers: { Range: "bytes=999999-" },
        })
      ).status,
      416,
    );
    assert.equal(
      (await fetch(`${app.origin}/video-studio/%2fetc%2fpasswd`)).status,
      400,
    );
    const record = await app.runtime.store.asset(asset.id);
    await unlink(record.file);
    await symlink("/etc/hosts", record.file);
    assert.equal((await fetch(app.origin + asset.src)).status, 404);
  } finally {
    await app.close();
  }
});

test("stream upload enforces complete byte limit and does not retain failed files", async () => {
  const app = await fixture({ maxUploadBytes: 8 });
  try {
    const status = await new Promise<number | undefined>((resolve, reject) => {
      const req = httpRequest(
        `${app.origin}/video-studio/api/assets?name=x.png&kind=image&duration=5`,
        { method: "POST" },
        (res) => {
          res.resume();
          resolve(res.statusCode);
        },
      );
      req.on("error", reject);
      req.write(Buffer.alloc(4));
      req.end(Buffer.alloc(5));
    });
    assert.equal(status, 413);
    assert.deepEqual(await readdir(join(app.root, "data/assets")), []);
  } finally {
    await app.close();
  }
});

test("project writes serialize, validate IDs, and reject external media locations", async () => {
  const app = await fixture();
  try {
    const project = createProject();
    const saves = ["first", "second", "third"].map((name) =>
      app.runtime.store.saveProject(project.id, { ...project, name }),
    );
    await Promise.all(saves);
    assert.equal((await app.runtime.store.projects())[0]?.name, "third");
    assert.deepEqual(await readdir(join(app.root, "data/projects")), [
      `${project.id}.json`,
    ]);
    await assert.rejects(
      app.runtime.store.saveProject("different-id", project),
      /ID/,
    );
    const asset = await upload(app.origin);
    await assert.rejects(
      app.runtime.store.canonicalProject({
        ...project,
        assets: [{ ...asset, src: "http://example.com/private" }],
      }),
      /已导入/,
    );
    const persisted = await app.runtime.store.saveProject(project.id, {
      ...project,
      assets: [asset],
    });
    assert.equal(persisted.assets[0]?.src, asset.src);
  } finally {
    await app.close();
  }
});

test("ASR unconfigured is explicit and registered provider results are validated", async () => {
  const app = await fixture();
  try {
    assert.equal((await app.runtime.capabilities()).asr.configured, false);
    const response = await fetch(`${app.origin}/video-studio/api/asr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: "missing" }),
    });
    assert.equal(response.status, 503);
    const registry = new AsrRegistry("test");
    const dispose = registry.register({
      id: "test",
      transcribe: async () => [{ start: 0, end: 1, text: "字幕" }],
    });
    assert.equal(registry.capabilities().configured, true);
    assert.throws(
      () => registry.register({ id: "test", transcribe: async () => [] }),
      /already registered/,
    );
    dispose();
    assert.equal(registry.capabilities().configured, false);
    assert.throws(() => parseSegments([{ start: 3, end: 2, text: "bad" }]));
  } finally {
    await app.close();
  }
});

test("one queue runs at a time, cancels queued work, and waits for active cancellation", async () => {
  const queue = new JobQueue();
  let started!: () => void;
  const running = new Promise<void>((resolve) => {
    started = resolve;
  });
  let stopped = false;
  const first = queue.enqueue("render", async ({ signal, progress }) => {
    progress(0.25);
    started();
    await new Promise<void>((resolve) =>
      signal.addEventListener(
        "abort",
        () =>
          queueMicrotask(() => {
            stopped = true;
            resolve();
          }),
        { once: true },
      ),
    );
    return { outputUrl: "/should-not-publish" };
  });
  let secondRan = false;
  const second = queue.enqueue("asr", async () => {
    secondRan = true;
    return { segments: [] };
  });
  await running;
  queue.assertInvariant();
  assert.equal(queue.get(first.id).progress, 0.25);
  assert.equal((await queue.cancel(second.id)).status, "cancelled");
  assert.equal(secondRan, false);
  await queue.dispose();
  assert.equal(stopped, true);
  assert.equal(queue.get(first.id).status, "cancelled");
  assert.equal(queue.get(first.id).outputUrl, undefined);
  queue.assertInvariant();
  assert.throws(() => queue.enqueue("render", async () => ({})), /关闭/);
});

test("runtime HMR disposal stops partial JSON and partial uploads and removes temporary assets", async () => {
  const app = await fixture();
  try {
    const partial = httpRequest(`${app.origin}/video-studio/api/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "9999" },
    });
    partial.on("error", () => undefined);
    partial.write("{");
    const uploading = httpRequest(
      `${app.origin}/video-studio/api/assets?name=x.png&kind=image&duration=5`,
      { method: "POST", headers: { "Content-Length": "9999" } },
    );
    uploading.on("error", () => undefined);
    uploading.write(PNG);
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    await app.runtime.dispose();
    assert.deepEqual(await readdir(join(app.root, "data/assets")), []);
    partial.destroy();
    uploading.destroy();
  } finally {
    await app.close();
  }
});

test("render media server serves only its captured asset IDs without exposing user cookies", async () => {
  const app = await fixture();
  try {
    const first = await upload(app.origin),
      other = await upload(app.origin);
    const server = await createRenderMediaServer([
      await app.runtime.store.asset(first.id),
    ]);
    try {
      const url = server.urls.get(first.id)!;
      assert.equal((await fetch(url)).status, 200);
      assert.equal((await fetch(url.replace(first.id, other.id))).status, 404);
      assert.equal((await fetch(new URL("/", url))).status, 404);
    } finally {
      await server.close();
    }
  } finally {
    await app.close();
  }
});

test("OpenAI-compatible adapter sends explicit timed format to a local test provider and normalizes segments", async () => {
  const root = await mkdtemp(join(tmpdir(), "video-asr-contract-"));
  const file = join(root, "audio.wav");
  await writeFile(file, Buffer.alloc(32));
  let requestBody = "";
  const server = createServer((req, res) => {
    void (async () => {
      for await (const part of req) requestBody += String(part);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          segments: [{ start: 0, end: 1.2, text: "已转录", speaker: "A" }],
        }),
      );
    })();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const provider = openAiAsrProvider({
      endpoint: `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1/audio/transcriptions`,
      model: "explicit-user-model",
      format: "diarized_json",
      apiKey: "local-test-only",
      timeoutMs: 1000,
      maxBytes: 1024,
    });
    const result = await provider.transcribe({
      asset: {
        asset: {
          id: "test",
          kind: "audio",
          duration: 2,
          name: "audio.wav",
          src: "/media/test",
        },
        file,
        bytes: 32,
      },
      signal: new AbortController().signal,
    });
    assert.deepEqual(result, [{ start: 0, end: 1.2, text: "已转录" }]);
    assert.match(requestBody, /diarized_json/);
    assert.match(requestBody, /chunking_strategy/);
    assert.match(requestBody, /explicit-user-model/);
    await assert.rejects(
      provider.transcribe({
        asset: {
          asset: {
            id: "test",
            kind: "audio",
            duration: 2,
            name: "audio.wav",
            src: "/media/test",
          },
          file,
          bytes: 1025,
        },
        signal: new AbortController().signal,
      }),
      /上传限制/,
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(root, { recursive: true, force: true });
  }
});
