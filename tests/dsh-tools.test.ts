import assert from "node:assert/strict";
import { mkdtemp, mkdir, realpath, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import type { Context } from "@deepseek-ai/cordis";
import type { ToolDefinition, ToolRunContext } from "@deepseek-ai/dsh-tools";
import { createProject } from "../src/core/project";
import { registerVideoStudioTools } from "../src/host/dsh-tools";
import { StudioRuntime } from "../src/host/runtime";
import type { Project, StudioJob } from "../src/types";

interface ToolJob {
  projectId: string;
  jobId: string;
  status: StudioJob["status"];
  outputUrl?: string;
}

async function fixture(context: TestContext) {
  const root = await mkdtemp(join(tmpdir(), "dsh-video-tools-"));
  const workspace = join(root, "workspace");
  const otherWorkspace = join(root, "other");
  await Promise.all([mkdir(workspace), mkdir(otherWorkspace)]);
  const runtime = new StudioRuntime({
    config: { dataDir: join(root, "data") },
    studioDir: join(root, "studio"),
    remotionDir: join(root, "remotion"),
    authorize: () => undefined,
    resolveWorkspace: async (sessionId) =>
      sessionId === "unknown-session" ? undefined : workspace,
  });
  await runtime.init();
  runtime.exporter.available = async () => true;
  runtime.exporter.render = async (_project, { id }) => ({
    outputUrl: `/video-studio/exports/${id}.mp4`,
  });
  const definitions = new Map<string, ToolDefinition>();
  const removed: string[] = [];
  const ctx = {
    tools: {
      register(definition: ToolDefinition) {
        definitions.set(definition.name, definition);
        return () => {
          removed.push(definition.name);
          definitions.delete(definition.name);
        };
      },
    },
  } as unknown as Context;
  const dispose = registerVideoStudioTools(ctx, runtime);
  context.after(async () => {
    await dispose();
    await runtime.dispose();
    await rm(root, { recursive: true, force: true });
  });
  const exec = (
    sessionId = "session-a",
    cwd = workspace,
    signal = new AbortController().signal,
  ) =>
    ({
      agent: { session: { id: sessionId, header: { cwd } } },
      signal,
    }) as unknown as ToolRunContext;
  const call = async <T = unknown>(
    name: string,
    args: unknown,
    execution = exec(),
  ): Promise<T> => {
    const definition = definitions.get(name);
    assert.ok(definition, `${name} is registered`);
    return (await definition.execute(args, execution)) as T;
  };
  const save = (project: Project) =>
    runtime.store.saveProject(project.id, project, null);
  const project = (cwd = workspace, sessionId = "origin-session"): Project => ({
    ...createProject(true),
    dsh: { workspacePath: cwd, sessionId },
  });
  return {
    root,
    workspace,
    otherWorkspace,
    runtime,
    definitions,
    removed,
    dispose,
    exec,
    call,
    save,
    project,
  };
}

test("tools use trusted session workspace, canonicalize aliases, and omit unbound or foreign projects", async (context) => {
  const f = await fixture(context);
  const alias = join(f.root, "workspace-link");
  await symlink(f.workspace, alias);
  const visible = await f.save(f.project(alias));
  const foreign = await f.save(f.project(f.otherWorkspace));
  const unbound = await f.save(createProject());
  await f.save(f.project(join(f.root, "deleted-workspace")));
  const summaries = await f.call<{ projectId: string }[]>("video_studio_list", {
    workspacePath: f.otherWorkspace,
    sessionId: "forged",
  });
  assert.deepEqual(
    summaries.map((p) => p.projectId),
    [visible.id],
  );
  const read = await f.call<Project>(
    "video_studio_read",
    { projectId: visible.id },
    f.exec("another-session-in-same-workspace"),
  );
  assert.equal(read.id, visible.id);
  for (const project of [foreign, unbound]) {
    await assert.rejects(
      f.call("video_studio_read", { projectId: project.id }),
      /工程尚未关联当前工作区/,
    );
  }
  await assert.rejects(
    f.call("video_studio_list", {}, {
      signal: new AbortController().signal,
    } as ToolRunContext),
    /已关联工作区的 DSH 会话/,
  );
});

test("tools and HTTP resolve the registered workspace when a session cwd is nested", async (context) => {
  const f = await fixture(context);
  const nested = join(f.workspace, "source");
  await mkdir(nested);
  const project = await f.save(f.project());
  const read = await f.call<Project>(
    "video_studio_read",
    { projectId: project.id },
    f.exec("nested-session", nested),
  );
  assert.equal(read.id, project.id);
  assert.equal(
    await f.runtime.resolveWorkspace(
      "nested-session",
      new AbortController().signal,
    ),
    await realpath(f.workspace),
  );
  await assert.rejects(
    f.call(
      "video_studio_read",
      { projectId: project.id },
      f.exec("unknown-session", f.workspace),
    ),
    /会话不存在/,
  );
});

test("updates require a session-owned read revision, preserve bindings and assets, and reject unexposed fields", async (context) => {
  const f = await fixture(context);
  const saved = await f.save(f.project());
  const args = {
    projectId: saved.id,
    expectedUpdatedAt: saved.updatedAt,
    changes: { name: "Agent 与用户一起编辑" },
  };
  await assert.rejects(f.call("video_studio_update", args), /请先使用/);
  await f.call("video_studio_read", { projectId: saved.id });
  await assert.rejects(
    f.call("video_studio_update", args, f.exec("another-session")),
    /请先使用/,
  );
  await assert.rejects(
    f.call("video_studio_update", {
      ...args,
      changes: { assets: [], dsh: { workspacePath: f.otherWorkspace } },
    }),
    /(?:assets|dsh|additional|unknown)/i,
  );
  const updated = await f.call<Project>("video_studio_update", args);
  assert.equal(updated.name, args.changes.name);
  assert.deepEqual(updated.dsh, saved.dsh);
  assert.deepEqual(updated.assets, saved.assets);
  assert.deepEqual(updated.clips, saved.clips);
  assert.ok(updated.updatedAt > saved.updatedAt);
  assert.equal((await f.runtime.store.project(saved.id)).name, updated.name);
});

test("an editor save between the Agent read and update fails with conflict and preserves the editor change", async (context) => {
  const f = await fixture(context);
  const saved = await f.save(f.project());
  await f.call("video_studio_read", { projectId: saved.id });
  const editor = await f.runtime.store.saveProject(
    saved.id,
    { ...saved, name: "用户刚保存的名称" },
    saved.updatedAt,
  );
  await assert.rejects(
    f.call("video_studio_update", {
      projectId: saved.id,
      expectedUpdatedAt: saved.updatedAt,
      changes: { name: "不应覆盖" },
    }),
    (error: unknown) => (error as { status?: number }).status === 409,
  );
  assert.deepEqual(await f.runtime.store.project(saved.id), editor);
});

test("render jobs share the editor queue while result access is isolated by submitting session", async (context) => {
  const f = await fixture(context);
  const saved = await f.save(f.project());
  const queued = await f.call<ToolJob>("video_studio_render", {
    projectId: saved.id,
  });
  assert.equal(queued.status, "queued");
  assert.equal(f.runtime.jobs.get(queued.jobId).kind, "render");
  for (const action of ["status", "cancel"]) {
    await assert.rejects(
      f.call(
        "video_studio_job",
        { jobId: queued.jobId, action },
        f.exec("another-session"),
      ),
      /只能查看或取消当前会话/,
    );
  }
  await new Promise<void>((resolve) => setImmediate(resolve));
  const result = await f.call<ToolJob>("video_studio_job", {
    jobId: queued.jobId,
    action: "status",
  });
  assert.equal(result.status, "completed");
  assert.equal(result.outputUrl, `/video-studio/exports/${queued.jobId}.mp4`);
  assert.equal(result.projectId, saved.id);
});

test("cancelled calls enqueue no work, and plugin disposal unregisters tools and settles running jobs", async (context) => {
  const f = await fixture(context);
  const saved = await f.save(f.project());
  const controller = new AbortController();
  controller.abort(new Error("Cancelled before dispatch"));
  let renders = 0;
  f.runtime.exporter.render = async (_project, { signal }) => {
    renders += 1;
    await new Promise<void>((resolve) => {
      if (signal.aborted) resolve();
      else signal.addEventListener("abort", () => resolve(), { once: true });
    });
    signal.throwIfAborted();
    return {};
  };
  await assert.rejects(
    f.call(
      "video_studio_render",
      { projectId: saved.id },
      f.exec("session-a", f.workspace, controller.signal),
    ),
    /Cancelled before dispatch/,
  );
  assert.equal(renders, 0);
  const queued = await f.call<ToolJob>("video_studio_render", {
    projectId: saved.id,
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(renders, 1);
  await f.dispose();
  assert.equal(f.runtime.jobs.get(queued.jobId).status, "cancelled");
  assert.equal(f.definitions.size, 0);
  assert.equal(new Set(f.removed).size, 5);
});

test("partial registration is unwound when another plugin owns a tool name", async (context) => {
  const f = await fixture(context);
  let registrations = 0;
  let disposals = 0;
  const ctx = {
    tools: {
      register() {
        registrations += 1;
        if (registrations === 3) throw new Error("Duplicate tool name");
        return () => {
          disposals += 1;
        };
      },
    },
  } as unknown as Context;
  assert.throws(() => registerVideoStudioTools(ctx, f.runtime), /Duplicate/);
  assert.equal(disposals, 2);
});
