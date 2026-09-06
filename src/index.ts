import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Context } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { StudioRuntime, type StudioConfig } from "./host/runtime";
import { registerVideoStudioTools } from "./host/dsh-tools";
import { sessionWorkspace } from "./host/workspace";

export type { AsrProvider, AsrRequest } from "./host/asr";
export type { StudioConfig } from "./host/runtime";
export const name = "video-studio";
export const inject = [
  "webServer",
  "connection",
  "tools",
  "sessions",
  "sessionPersistence",
  "workspaceRegistry",
];
export const Config = z.object({
  dataDir: z.string(),
  browserExecutable: z.string(),
  renderConcurrency: z.natural().min(1).max(8),
  renderTimeoutMs: z.natural().min(1000),
  maxUploadBytes: z.natural().min(1),
  maxQueuedJobs: z.natural().min(1),
  asrProvider: z.string(),
  asrEndpoint: z.string(),
  asrModel: z.string(),
  asrFormat: z.union([z.const("diarized_json"), z.const("verbose_json")]),
  asrApiKeyEnv: z.string(),
  asrTimeoutMs: z.natural().min(1000),
  asrMaxBytes: z.natural().min(1),
});

interface WebServer {
  register(route: {
    kind: "prefix";
    path: string;
    handler(req: IncomingMessage, res: ServerResponse): Promise<void>;
  }): () => void;
}
interface Connection {
  requestRejection(req: IncomingMessage): number | undefined;
}

declare module "@deepseek-ai/cordis" {
  interface Context {
    videoStudio: StudioRuntime;
    videoStudioAsr: import("./host/asr").AsrRegistry;
  }
}

/** Mount reversible routes and the ASR provider seam beside the DSH application. */
export async function apply(
  ctx: Context,
  config: StudioConfig = {},
): Promise<void> {
  const lib = dirname(fileURLToPath(import.meta.url));
  const webServer = ctx.get("webServer") as WebServer;
  const connection = ctx.get("connection") as Connection;
  const runtime = new StudioRuntime({
    config,
    studioDir: resolve(lib, "studio"),
    remotionDir: resolve(lib, "remotion"),
    authorize: (req) => connection.requestRejection(req),
    resolveWorkspace: (sessionId, signal) =>
      sessionWorkspace(
        sessionId,
        signal,
        ctx.get("sessions") as unknown as Parameters<
          typeof sessionWorkspace
        >[2],
        ctx.get("sessionPersistence") as Parameters<typeof sessionWorkspace>[3],
        ctx.get("workspaceRegistry") as Parameters<typeof sessionWorkspace>[4],
      ),
  });
  await runtime.init();
  ctx.effect(
    () => registerVideoStudioTools(ctx, runtime),
    "video-studio: model tools",
  );
  ctx.effect(() => {
    const unprovide = ctx.reflect.provide("videoStudio", runtime);
    const unprovideAsr = ctx.reflect.provide("videoStudioAsr", runtime.asr);
    let unregister: (() => void) | undefined;
    try {
      unregister = webServer.register({
        kind: "prefix",
        path: "/video-studio",
        handler: runtime.handle,
      });
    } catch (error) {
      void unprovide();
      void unprovideAsr();
      void runtime.dispose();
      throw error;
    }
    return async () => {
      unregister?.();
      await runtime.dispose();
      await unprovideAsr();
      await unprovide();
    };
  }, "video-studio: authenticated routes and runtime");
}
