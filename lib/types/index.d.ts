import type { Context } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { StudioRuntime, type StudioConfig } from "./host/runtime";
export type { AsrProvider, AsrRequest } from "./host/asr";
export type { StudioConfig } from "./host/runtime";
export declare const name = "video-studio";
export declare const inject: string[];
export declare const Config: z<Schemastery.ObjectS<{
    dataDir: z<string, string>;
    browserExecutable: z<string, string>;
    renderConcurrency: z<number, number>;
    renderTimeoutMs: z<number, number>;
    maxUploadBytes: z<number, number>;
    maxQueuedJobs: z<number, number>;
    asrProvider: z<string, string>;
    asrEndpoint: z<string, string>;
    asrModel: z<string, string>;
    asrFormat: z<"diarized_json" | "verbose_json", "diarized_json" | "verbose_json">;
    asrApiKeyEnv: z<string, string>;
    asrTimeoutMs: z<number, number>;
    asrMaxBytes: z<number, number>;
}>, Schemastery.ObjectT<{
    dataDir: z<string, string>;
    browserExecutable: z<string, string>;
    renderConcurrency: z<number, number>;
    renderTimeoutMs: z<number, number>;
    maxUploadBytes: z<number, number>;
    maxQueuedJobs: z<number, number>;
    asrProvider: z<string, string>;
    asrEndpoint: z<string, string>;
    asrModel: z<string, string>;
    asrFormat: z<"diarized_json" | "verbose_json", "diarized_json" | "verbose_json">;
    asrApiKeyEnv: z<string, string>;
    asrTimeoutMs: z<number, number>;
    asrMaxBytes: z<number, number>;
}>>;
declare module "@deepseek-ai/cordis" {
    interface Context {
        videoStudio: StudioRuntime;
        videoStudioAsr: import("./host/asr").AsrRegistry;
    }
}
/** Mount reversible routes and the ASR provider seam beside the DSH application. */
export declare function apply(ctx: Context, config?: StudioConfig): Promise<void>;
