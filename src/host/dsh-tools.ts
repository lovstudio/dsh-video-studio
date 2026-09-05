import { realpath } from "node:fs/promises";
import type { Context } from "@deepseek-ai/cordis";
import {
  defineTool,
  type ToolDefinition,
  type ToolRunContext,
} from "@deepseek-ai/dsh-tools";
import { durationInFrames } from "../core/project";
import type { Project, StudioJob } from "../types";
import { HttpError } from "./http";
import type { StudioRuntime } from "./runtime";

const clipProperties = {
  id: { type: "string", required: true },
  trackId: {
    type: "string",
    enum: ["video", "titles", "captions", "audio"],
    required: true,
  },
  kind: { type: "string", enum: ["media", "title", "caption"], required: true },
  name: { type: "string", required: true },
  assetId: { type: "string" },
  start: { type: "integer", required: true },
  duration: { type: "integer", required: true },
  sourceStart: { type: "integer", required: true },
  text: { type: "string", required: true },
  motion: {
    type: "string",
    enum: ["none", "fade", "rise", "drift"],
    required: true,
  },
  volume: { type: "number", required: true },
  opacity: { type: "number", required: true },
  scale: { type: "number", required: true },
  x: { type: "number", required: true },
  y: { type: "number", required: true },
  fontSize: { type: "number", required: true },
  tone: { type: "string", enum: ["clay", "sage", "ink"], required: true },
} as const;
const clipsSchema = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    properties: clipProperties,
  },
} as const;
const projectValueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    version: { type: "integer", required: true },
    id: { type: "string", required: true },
    name: { type: "string", required: true },
    fps: { type: "number", required: true },
    width: { type: "number", required: true },
    height: { type: "number", required: true },
    updatedAt: { type: "string", required: true },
    dsh: {
      type: "object",
      additionalProperties: false,
      properties: {
        workspacePath: { type: "string", required: true },
        sessionId: { type: "string", required: true },
      },
    },
    clips: { ...clipsSchema, required: true },
    assets: {
      type: "array",
      required: true,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", required: true },
          name: { type: "string", required: true },
          kind: {
            type: "string",
            enum: ["video", "audio", "image"],
            required: true,
          },
          src: { type: "string", required: true },
          duration: { type: "number", required: true },
          width: { type: "number" },
          height: { type: "number" },
          waveform: { type: "array", items: { type: "number" } },
        },
      },
    },
  },
} as const;
const summarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectId: { type: "string", required: true },
    name: { type: "string", required: true },
    updatedAt: { type: "string", required: true },
    clipCount: { type: "integer", required: true },
    durationInFrames: { type: "integer", required: true },
    fps: { type: "number", required: true },
    width: { type: "number", required: true },
    height: { type: "number", required: true },
  },
} as const;
const jobSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectId: { type: "string", required: true },
    jobId: { type: "string", required: true },
    status: {
      type: "string",
      enum: ["queued", "running", "completed", "failed", "cancelled"],
      required: true,
    },
    progress: { type: "number", required: true },
    message: { type: "string" },
    outputUrl: { type: "string" },
  },
} as const;

interface Scope {
  sessionId: string;
  workspacePath: string;
}

/** Session identity comes from dispatch, never from model arguments. */
async function executionScope(exec: ToolRunContext): Promise<Scope> {
  exec.signal.throwIfAborted();
  const session = exec.agent?.session;
  if (!session?.header.cwd)
    throw new Error("视频工具需要一个已关联工作区的 DSH 会话");
  const workspacePath = await realpath(session.header.cwd);
  exec.signal.throwIfAborted();
  return { sessionId: session.id, workspacePath };
}

async function belongsToWorkspace(
  project: Project,
  scope: Scope,
): Promise<boolean> {
  if (!project.dsh) return false;
  try {
    return (await realpath(project.dsh.workspacePath)) === scope.workspacePath;
  } catch (error) {
    if (
      ["ENOENT", "ENOTDIR"].includes(
        (error as NodeJS.ErrnoException).code ?? "",
      )
    )
      return false;
    throw error;
  }
}

function summary(project: Project) {
  return {
    projectId: project.id,
    name: project.name,
    updatedAt: project.updatedAt,
    clipCount: project.clips.length,
    durationInFrames: durationInFrames(project),
    fps: project.fps,
    width: project.width,
    height: project.height,
  };
}

function jobValue(projectId: string, job: StudioJob) {
  return {
    projectId,
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    ...(job.message !== undefined ? { message: job.message } : {}),
    ...(job.outputUrl !== undefined ? { outputUrl: job.outputUrl } : {}),
  };
}

/** Register tools over the same persisted projects and render queue as the editor. */
export function registerVideoStudioTools(
  ctx: Context,
  runtime: Pick<StudioRuntime, "store" | "jobs" | "exporter">,
): () => Promise<void> {
  const observations = new Map<string, Map<string, string>>();
  const ownedJobs = new Map<string, { sessionId: string; projectId: string }>();
  const disposers: (() => void)[] = [];
  const readProject = async (id: string, scope: Scope): Promise<Project> => {
    const project = await runtime.store.project(id);
    if (!(await belongsToWorkspace(project, scope)))
      throw new HttpError(
        403,
        "工程尚未关联当前工作区，请先在视频工作台中关联",
      );
    return project;
  };
  const observe = (scope: Scope, project: Project): void => {
    let session = observations.get(scope.sessionId);
    if (!session) observations.set(scope.sessionId, (session = new Map()));
    session.set(project.id, project.updatedAt);
  };
  const projectOutput = {
    schema: projectValueSchema,
    render: (_args: unknown, value: Project) => [
      { type: "text" as const, text: JSON.stringify(value) },
    ],
    presentationMeta: (_args: unknown, value: Project) => ({
      kind: "video-studio-project",
      ...summary(value),
    }),
  };

  const definitions: ToolDefinition[] = [
    defineTool({
      name: "video_studio_list",
      description:
        "列出当前 DSH 工作区已关联的视频工程。未关联工程须由用户在视频工作台中关联。",
      parameters: {},
      output: {
        schema: { type: "array", items: summarySchema },
        render: (_args, value) => [
          { type: "text", text: JSON.stringify(value) },
        ],
      },
      isConcurrencySafe: () => true,
      async execute(_args, exec) {
        const scope = await executionScope(exec);
        const projects = await runtime.store.projects();
        const visible = await Promise.all(
          projects.map(async (project) =>
            (await belongsToWorkspace(project, scope))
              ? summary(project)
              : null,
          ),
        );
        exec.signal.throwIfAborted();
        return visible.filter((project) => project !== null);
      },
    }),
    defineTool({
      name: "video_studio_read",
      description:
        "读取当前工作区的视频工程、素材、完整时间线和 updatedAt 版本。编辑前必须先调用本工具；时间均以帧计。",
      parameters: { projectId: { type: "string", required: true } },
      output: projectOutput,
      isConcurrencySafe: () => true,
      async execute(args, exec) {
        const scope = await executionScope(exec);
        const project = await readProject(args.projectId, scope);
        exec.signal.throwIfAborted();
        observe(scope, project);
        return project;
      },
    }),
    defineTool({
      name: "video_studio_update",
      description:
        "编辑当前工作区的视频工程。先 video_studio_read，再传回该版本的 updatedAt。changes.clips 是完整时间线，须保留未修改片段；资产和工作区关联不可修改。遇到版本冲突必须重新读取后合并用户改动。",
      parameters: {
        projectId: { type: "string", required: true },
        expectedUpdatedAt: { type: "string", required: true },
        changes: {
          type: "object",
          additionalProperties: false,
          required: true,
          properties: {
            name: { type: "string" },
            fps: { type: "integer", enum: [24, 25, 30, 60] },
            width: { type: "integer" },
            height: { type: "integer" },
            clips: clipsSchema,
          },
        },
      },
      output: projectOutput,
      async execute(args, exec) {
        const scope = await executionScope(exec);
        if (
          observations.get(scope.sessionId)?.get(args.projectId) !==
          args.expectedUpdatedAt
        )
          throw new HttpError(
            409,
            "请先使用 video_studio_read 读取工程的最新版本",
          );
        if (Object.keys(args.changes).length === 0)
          throw new Error("changes 至少需要一个要修改的字段");
        const current = await readProject(args.projectId, scope);
        exec.signal.throwIfAborted();
        const committed = await runtime.store.saveProject(
          current.id,
          { ...current, ...args.changes },
          args.expectedUpdatedAt,
        );
        observe(scope, committed);
        return committed;
      },
    }),
    defineTool({
      name: "video_studio_render",
      description:
        "将当前工作区视频工程的最新已保存版本提交到工作台导出队列，返回 jobId。用 video_studio_job 查询进度并取得完成后的 MP4 下载地址。",
      parameters: { projectId: { type: "string", required: true } },
      output: {
        schema: jobSchema,
        render: (_args, value) => [
          { type: "text", text: JSON.stringify(value) },
        ],
        presentationMeta: (_args, value) => ({
          kind: "video-studio-render",
          ...value,
        }),
      },
      async execute(args, exec) {
        const scope = await executionScope(exec);
        const project = await readProject(args.projectId, scope);
        const snapshot = await runtime.store.canonicalProject(project);
        if (snapshot.clips.length === 0)
          throw new Error("工程时间线为空，请先添加内容");
        if (!(await runtime.exporter.available()))
          throw new Error(
            "导出环境未就绪，请在工作台中检查 Chrome 与 Remotion 配置",
          );
        exec.signal.throwIfAborted();
        const job = runtime.jobs.enqueue("render", (execution) =>
          runtime.exporter.render(snapshot, execution),
        );
        ownedJobs.set(job.id, {
          sessionId: scope.sessionId,
          projectId: project.id,
        });
        return jobValue(project.id, job);
      },
    }),
    defineTool({
      name: "video_studio_job",
      description:
        "查询或取消当前会话提交的视频导出任务。仅当 status 为 completed 且提供 outputUrl 时才表示已导出成功。",
      parameters: {
        jobId: { type: "string", required: true },
        action: { type: "string", enum: ["status", "cancel"], required: true },
      },
      output: {
        schema: jobSchema,
        render: (_args, value) => [
          { type: "text", text: JSON.stringify(value) },
        ],
        presentationMeta: (_args, value) => ({
          kind: "video-studio-job",
          ...value,
        }),
      },
      async execute(args, exec) {
        const scope = await executionScope(exec);
        const owner = ownedJobs.get(args.jobId);
        if (!owner || owner.sessionId !== scope.sessionId)
          throw new HttpError(403, "只能查看或取消当前会话提交的视频任务");
        const job =
          args.action === "cancel"
            ? await runtime.jobs.cancel(args.jobId)
            : runtime.jobs.get(args.jobId);
        return jobValue(owner.projectId, job);
      },
    }),
  ];

  try {
    for (const definition of definitions)
      disposers.push(ctx.tools.register(definition));
  } catch (error) {
    for (const dispose of disposers.reverse()) dispose();
    throw error;
  }
  return async () => {
    for (const dispose of disposers.splice(0).reverse()) dispose();
    observations.clear();
    await Promise.allSettled(
      [...ownedJobs.keys()].map((id) => runtime.jobs.cancel(id)),
    );
    ownedJobs.clear();
  };
}
