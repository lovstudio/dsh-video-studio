import type { CaptionSegment, StudioJob } from "../types";
export interface JobResult {
    outputUrl?: string;
    segments?: CaptionSegment[];
}
export interface JobExecution {
    id: string;
    signal: AbortSignal;
    progress(value: number): void;
}
type JobTask = (execution: JobExecution) => Promise<JobResult>;
/** One bounded queue owns execution, cancellation, and teardown settlement. */
export declare class JobQueue {
    private readonly maxQueued;
    private readonly maxRetained;
    private entries;
    private pending;
    private active;
    private disposed;
    constructor(maxQueued?: number, maxRetained?: number);
    enqueue(kind: StudioJob["kind"], task: JobTask): StudioJob;
    get(id: string): StudioJob;
    cancel(id: string): Promise<StudioJob>;
    private pump;
    private run;
    dispose(): Promise<void>;
    /** Independently compare the running record with the executor reservation. */
    assertInvariant(): void;
}
export {};
