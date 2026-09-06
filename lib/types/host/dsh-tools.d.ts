import type { Context } from "@deepseek-ai/cordis";
import type { StudioRuntime } from "./runtime";
/** Register tools over the same persisted projects and render queue as the editor. */
export declare function registerVideoStudioTools(ctx: Context, runtime: Pick<StudioRuntime, "store" | "jobs" | "exporter" | "resolveWorkspace">): () => Promise<void>;
