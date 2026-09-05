import { resolve } from "node:path";
import { homedir } from "node:os";
import type { IncomingMessage, ServerResponse } from "node:http";
import { z, ZodError } from "zod";
import type { StudioCapabilities } from "../types";
import { AsrRegistry, openAiAsrProvider, parseSegments } from "./asr";
import {
  assertId,
  containedFile,
  HttpError,
  json,
  PREFIX,
  readJson,
  serveFile,
} from "./http";
import { JobQueue } from "./jobs";
import { RemotionExporter } from "./render";
import { MAX_UPLOAD_BYTES, StudioStore } from "./storage";

export interface StudioConfig {
  dataDir?: string;
  browserExecutable?: string;
  renderConcurrency?: number;
  renderTimeoutMs?: number;
  maxUploadBytes?: number;
  maxQueuedJobs?: number;
  asrProvider?: string;
  asrEndpoint?: string;
  asrModel?: string;
  asrFormat?: "diarized_json" | "verbose_json";
  asrApiKeyEnv?: string;
  asrTimeoutMs?: number;
  asrMaxBytes?: number;
}
export interface StudioRuntimeOptions {
  config?: StudioConfig;
  studioDir: string;
  remotionDir: string;
  authorize(req: IncomingMessage): number | undefined;
}

const configSchema = z.object({
  dataDir: z.string().min(1),
  browserExecutable: z.string().optional(),
  renderConcurrency: z.number().int().min(1).max(8),
  renderTimeoutMs: z.number().int().min(1000).max(3600_000),
  maxUploadBytes: z.number().int().min(1).max(MAX_UPLOAD_BYTES),
  maxQueuedJobs: z.number().int().min(1).max(100),
  asrProvider: z.string().min(1),
  asrEndpoint: z.string().optional(),
  asrModel: z.string().optional(),
  asrFormat: z.enum(["diarized_json", "verbose_json"]).optional(),
  asrApiKeyEnv: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
  asrTimeoutMs: z.number().int().min(1000).max(3600_000),
  asrMaxBytes: z.number().int().min(1).max(MAX_UPLOAD_BYTES),
});

/** Resolve deployment choices once; API requests cannot override server credentials. */
export function resolveStudioConfig(
  config: StudioConfig = {},
  env: NodeJS.ProcessEnv = process.env,
): z.infer<typeof configSchema> {
  return configSchema.parse({
    dataDir:
      config.dataDir ??
      env.DSH_VIDEO_DATA_DIR ??
      resolve(homedir(), ".dsh/video-studio"),
    browserExecutable:
      config.browserExecutable ?? env.DSH_VIDEO_BROWSER_EXECUTABLE,
    renderConcurrency: config.renderConcurrency ?? 2,
    renderTimeoutMs: config.renderTimeoutMs ?? 15 * 60_000,
    maxUploadBytes: config.maxUploadBytes ?? MAX_UPLOAD_BYTES,
    maxQueuedJobs: config.maxQueuedJobs ?? 16,
    asrProvider:
      config.asrProvider ?? env.DSH_VIDEO_ASR_PROVIDER ?? "openai-compatible",
    asrEndpoint: config.asrEndpoint ?? env.DSH_VIDEO_ASR_ENDPOINT,
    asrModel: config.asrModel ?? env.DSH_VIDEO_ASR_MODEL,
    asrFormat: config.asrFormat ?? env.DSH_VIDEO_ASR_FORMAT,
    asrApiKeyEnv: config.asrApiKeyEnv ?? "DSH_VIDEO_ASR_API_KEY",
    asrTimeoutMs: config.asrTimeoutMs ?? 10 * 60_000,
    asrMaxBytes: config.asrMaxBytes ?? 25 * 1024 * 1024,
  });
}

/** Shared HTTP owner for both DSH and the explicit loopback development server. */
export class StudioRuntime {
  readonly store: StudioStore;
  readonly jobs: JobQueue;
  readonly asr: AsrRegistry;
  readonly exporter: RemotionExporter;
  readonly config: ReturnType<typeof resolveStudioConfig>;
  private readonly shutdown = new AbortController();
  private readonly requests = new Set<Promise<void>>();
  constructor(private readonly options: StudioRuntimeOptions) {
    this.config = resolveStudioConfig(options.config);
    this.store = new StudioStore(this.config.dataDir);
    this.jobs = new JobQueue(this.config.maxQueuedJobs);
    this.asr = new AsrRegistry(this.config.asrProvider);
    const apiKey = process.env[this.config.asrApiKeyEnv];
    if (
      this.config.asrEndpoint &&
      this.config.asrModel &&
      this.config.asrFormat &&
      apiKey
    )
      this.asr.register(
        openAiAsrProvider({
          endpoint: this.config.asrEndpoint,
          model: this.config.asrModel,
          format: this.config.asrFormat,
          apiKey,
          timeoutMs: this.config.asrTimeoutMs,
          maxBytes: this.config.asrMaxBytes,
        }),
      );
    this.exporter = new RemotionExporter(
      {
        bundleDir: options.remotionDir,
        browserExecutable: this.config.browserExecutable,
        timeoutMs: this.config.renderTimeoutMs,
        concurrency: this.config.renderConcurrency,
      },
      this.store,
    );
  }
  async init(): Promise<void> {
    await this.store.init();
  }
  async capabilities(): Promise<StudioCapabilities> {
    return {
      asr: this.asr.capabilities(),
      render: { available: await this.exporter.available() },
      maxUploadBytes: this.config.maxUploadBytes,
    };
  }
  handle = (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const abort = (): void => {
      req.destroy();
      res.destroy();
    };
    this.shutdown.signal.addEventListener("abort", abort, { once: true });
    const operation = this.dispatch(req, res).catch((error) => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      const code = (error as NodeJS.ErrnoException).code;
      const status =
        error instanceof HttpError
          ? error.status
          : error instanceof ZodError ||
              error instanceof URIError ||
              error instanceof SyntaxError
            ? 400
            : ["ENOENT", "ENOTDIR", "ELOOP"].includes(code ?? "")
              ? 404
              : 500;
      const message =
        error instanceof HttpError
          ? error.message
          : error instanceof ZodError
            ? error.issues
                .map((issue) => issue.message)
                .slice(0, 3)
                .join("；")
            : status === 404
              ? "资源不存在"
              : status === 400
                ? "请求格式无效"
                : "工作台处理请求失败";
      json(res, status, { error: message });
    });
    this.requests.add(operation);
    void operation.finally(() => {
      this.requests.delete(operation);
      this.shutdown.signal.removeEventListener("abort", abort);
    });
    return operation;
  };
  private async dispatch(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    const rejection = this.options.authorize(req);
    if (rejection !== undefined)
      throw new HttpError(
        rejection,
        rejection === 401 ? "请先登录 DSH" : "请求来源未获允许",
      );
    if (this.shutdown.signal.aborted)
      throw new HttpError(503, "工作台正在关闭");
    const raw = req.url ?? "/";
    if (/%(?:2f|5c|00)/i.test(raw.split("?")[0] ?? "") || raw.includes("\\"))
      throw new HttpError(400, "路径格式无效");
    const url = new URL(raw, "http://localhost");
    const path = decodeURIComponent(url.pathname);
    if (path !== PREFIX && !path.startsWith(`${PREFIX}/`))
      throw new HttpError(404, "资源不存在");
    const route = path.slice(PREFIX.length);
    const method = req.method;
    if (route === "/api/capabilities" && method === "GET") {
      json(res, 200, await this.capabilities());
      return;
    }
    if (route === "/api/projects" && method === "GET") {
      json(res, 200, await this.store.projects());
      return;
    }
    const projectMatch = /^\/api\/projects\/([^/]+)$/.exec(route);
    if (projectMatch && method === "GET") {
      json(res, 200, await this.store.project(assertId(projectMatch[1]!)));
      return;
    }
    if (projectMatch && method === "PUT") {
      if (req.headers["x-studio-revision"] === undefined)
        throw new HttpError(428, "工作台已更新，请刷新页面后再保存工程。");
      json(
        res,
        200,
        await this.store.saveProject(
          assertId(projectMatch[1]!),
          await readJson(req),
          req.headers["x-studio-revision"] === "new"
            ? null
            : z.string().datetime().parse(req.headers["x-studio-revision"]),
        ),
      );
      return;
    }
    if (route === "/api/assets" && method === "POST") {
      json(
        res,
        201,
        await this.store.upload(
          req,
          url.searchParams,
          this.shutdown.signal,
          this.config.maxUploadBytes,
        ),
      );
      return;
    }
    if (route === "/api/render" && method === "POST") {
      const body = z
        .object({ project: z.unknown() })
        .parse(await readJson(req));
      const snapshot = await this.store.canonicalProject(body.project);
      if (!snapshot.clips.length)
        throw new HttpError(400, "请先在时间线上添加内容");
      if (!(await this.exporter.available()))
        throw new HttpError(
          503,
          "导出环境未就绪，请构建 Remotion 场景并配置可用的 Chrome",
        );
      json(
        res,
        202,
        this.jobs.enqueue("render", (execution) =>
          this.exporter.render(snapshot, execution),
        ),
      );
      return;
    }
    if (route === "/api/asr" && method === "POST") {
      const body = z
        .object({
          assetId: z.string(),
          language: z
            .string()
            .regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/)
            .optional(),
        })
        .parse(await readJson(req));
      const provider = this.asr.resolve();
      const asset = await this.store.asset(body.assetId);
      if (asset.asset.kind === "image")
        throw new HttpError(400, "图片不包含可转录的音轨");
      json(
        res,
        202,
        this.jobs.enqueue("asr", async ({ signal }) => {
          const segments = parseSegments(
            await provider.transcribe({
              asset,
              language: body.language,
              signal,
            }),
          );
          if (
            segments.length > 3000 ||
            segments.some((segment) => segment.end > asset.asset.duration + 0.1)
          )
            throw new HttpError(502, "ASR 时间片段超过源素材时长或工程容量");
          return { segments };
        }),
      );
      return;
    }
    const jobMatch = /^\/api\/jobs\/([^/]+)(\/cancel)?$/.exec(route);
    if (jobMatch && method === "GET" && !jobMatch[2]) {
      json(res, 200, this.jobs.get(assertId(jobMatch[1]!)));
      return;
    }
    if (jobMatch && method === "POST" && jobMatch[2]) {
      json(res, 200, await this.jobs.cancel(assertId(jobMatch[1]!)));
      return;
    }
    const assetMatch = /^\/media\/([^/]+)$/.exec(route);
    if (assetMatch) {
      await serveFile(
        req,
        res,
        (await this.store.asset(assertId(assetMatch[1]!))).file,
        { immutable: true },
      );
      return;
    }
    const exportMatch = /^\/exports\/([^/]+)\.mp4$/.exec(route);
    if (exportMatch) {
      await serveFile(
        req,
        res,
        this.store.exportPath(assertId(exportMatch[1]!)),
        { download: `Video-Studio-${exportMatch[1]}.mp4` },
      );
      return;
    }
    if (route.startsWith("/api/"))
      throw new HttpError(405, "接口或请求方法不受支持");
    if (method !== "GET" && method !== "HEAD")
      throw new HttpError(405, "仅支持 GET / HEAD");
    const relative =
      route === "" || route === "/" ? "index.html" : route.slice(1);
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    await serveFile(
      req,
      res,
      await containedFile(this.options.studioDir, relative),
    );
  }
  async dispose(): Promise<void> {
    this.shutdown.abort();
    await this.jobs.dispose();
    await Promise.allSettled([...this.requests]);
    await this.store.dispose();
    this.asr.clear();
  }
}
