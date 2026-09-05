import type { Project } from "../types";
import type { JobExecution, JobResult } from "./jobs";
import type { StoredAsset, StudioStore } from "./storage";
export interface RenderConfig {
    bundleDir: string;
    browserExecutable?: string;
    timeoutMs: number;
    concurrency: number;
}
export declare function detectBrowser(explicit?: string): Promise<string | undefined>;
/** One render can read only the uploaded assets captured in its immutable project. */
export declare function createRenderMediaServer(assets: StoredAsset[]): Promise<{
    urls: Map<string, string>;
    close(): Promise<void>;
}>;
/** Remotion exporter uses one isolated headless browser and an atomic output. */
export declare class RemotionExporter {
    private readonly config;
    private readonly store;
    constructor(config: RenderConfig, store: StudioStore);
    available(): Promise<boolean>;
    render(project: Project, execution: JobExecution): Promise<JobResult>;
}
