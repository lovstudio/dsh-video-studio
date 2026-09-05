import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import type { StudioCapabilities } from "../types";
import { AsrRegistry } from "./asr";
import { JobQueue } from "./jobs";
import { RemotionExporter } from "./render";
import { StudioStore } from "./storage";
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
declare const configSchema: z.ZodObject<{
    dataDir: z.ZodString;
    browserExecutable: z.ZodOptional<z.ZodString>;
    renderConcurrency: z.ZodNumber;
    renderTimeoutMs: z.ZodNumber;
    maxUploadBytes: z.ZodNumber;
    maxQueuedJobs: z.ZodNumber;
    asrProvider: z.ZodString;
    asrEndpoint: z.ZodOptional<z.ZodString>;
    asrModel: z.ZodOptional<z.ZodString>;
    asrFormat: z.ZodOptional<z.ZodEnum<{
        diarized_json: "diarized_json";
        verbose_json: "verbose_json";
    }>>;
    asrApiKeyEnv: z.ZodString;
    asrTimeoutMs: z.ZodNumber;
    asrMaxBytes: z.ZodNumber;
}, z.core.$strip>;
/** Resolve deployment choices once; API requests cannot override server credentials. */
export declare function resolveStudioConfig(config?: StudioConfig, env?: NodeJS.ProcessEnv): z.infer<typeof configSchema>;
/** Shared HTTP owner for both DSH and the explicit loopback development server. */
export declare class StudioRuntime {
    private readonly options;
    readonly store: StudioStore;
    readonly jobs: JobQueue;
    readonly asr: AsrRegistry;
    readonly exporter: RemotionExporter;
    readonly config: ReturnType<typeof resolveStudioConfig>;
    private readonly shutdown;
    private readonly requests;
    constructor(options: StudioRuntimeOptions);
    init(): Promise<void>;
    capabilities(): Promise<StudioCapabilities>;
    handle: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    private dispatch;
    dispose(): Promise<void>;
}
export {};
