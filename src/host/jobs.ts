import { randomUUID } from "node:crypto";
import type { CaptionSegment, StudioJob } from "../types";
import { HttpError } from "./http";

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
interface Entry {
  job: StudioJob;
  task: JobTask;
  abort: AbortController;
  done: Promise<void>;
  settle(): void;
}

/** One bounded queue owns execution, cancellation, and teardown settlement. */
export class JobQueue {
  private entries = new Map<string, Entry>();
  private pending: Entry[] = [];
  private active: Entry | undefined;
  private disposed = false;
  constructor(
    private readonly maxQueued = 16,
    private readonly maxRetained = 1000,
  ) {}
  enqueue(kind: StudioJob["kind"], task: JobTask): StudioJob {
    if (this.disposed) throw new HttpError(503, "工作台正在关闭");
    if (
      this.pending.length + Number(this.active !== undefined) >=
      this.maxQueued
    )
      throw new HttpError(429, "任务队列已满，请等待当前任务完成");
    while (this.entries.size >= this.maxRetained) {
      const completed = [...this.entries].find(([, item]) =>
        ["completed", "failed", "cancelled"].includes(item.job.status),
      );
      if (!completed) throw new HttpError(429, "任务记录已满");
      this.entries.delete(completed[0]);
    }
    let settle!: () => void;
    const done = new Promise<void>((resolve) => {
      settle = resolve;
    });
    const entry: Entry = {
      job: {
        id: randomUUID(),
        kind,
        status: "queued",
        progress: 0,
        createdAt: new Date().toISOString(),
      },
      task,
      abort: new AbortController(),
      done,
      settle,
    };
    this.entries.set(entry.job.id, entry);
    this.pending.push(entry);
    queueMicrotask(() => this.pump());
    return structuredClone(entry.job);
  }
  get(id: string): StudioJob {
    const entry = this.entries.get(id);
    if (!entry) throw new HttpError(404, "任务不存在或已过期");
    return structuredClone(entry.job);
  }
  async cancel(id: string): Promise<StudioJob> {
    const entry = this.entries.get(id);
    if (!entry) throw new HttpError(404, "任务不存在或已过期");
    if (entry.job.status === "queued") {
      this.pending = this.pending.filter((item) => item !== entry);
      entry.abort.abort();
      entry.job.status = "cancelled";
      entry.settle();
    } else if (entry.job.status === "running") {
      entry.job.message = "正在取消";
      entry.abort.abort();
      await entry.done;
    }
    return structuredClone(entry.job);
  }
  private pump(): void {
    if (this.active || this.disposed) return;
    const entry = this.pending.shift();
    if (!entry) return;
    this.active = entry;
    entry.job.status = "running";
    void this.run(entry);
  }
  private async run(entry: Entry): Promise<void> {
    try {
      const result = await entry.task({
        id: entry.job.id,
        signal: entry.abort.signal,
        progress: (value) => {
          if (
            !this.disposed &&
            !entry.abort.signal.aborted &&
            entry.job.status === "running"
          )
            entry.job.progress = Math.max(
              entry.job.progress,
              Math.min(0.99, value),
            );
        },
      });
      entry.abort.signal.throwIfAborted();
      entry.job = { ...entry.job, ...result, status: "completed", progress: 1 };
    } catch (error) {
      entry.job.status = entry.abort.signal.aborted ? "cancelled" : "failed";
      entry.job.message = entry.abort.signal.aborted
        ? "任务已取消"
        : error instanceof Error
          ? error.message.slice(0, 800)
          : "任务执行失败";
    } finally {
      this.active = undefined;
      entry.settle();
      this.pump();
    }
  }
  async dispose(): Promise<void> {
    this.disposed = true;
    for (const entry of this.pending.splice(0)) {
      entry.abort.abort();
      entry.job.status = "cancelled";
      entry.settle();
    }
    if (this.active) {
      const active = this.active;
      active.abort.abort();
      await active.done;
    }
  }
  /** Independently compare the running record with the executor reservation. */
  assertInvariant(): void {
    const running = [...this.entries.values()].filter(
      (entry) => entry.job.status === "running",
    );
    if (
      running.length !== Number(this.active !== undefined) ||
      (this.active && running[0] !== this.active)
    )
      throw new Error(
        "Video Studio queue reservation and running jobs diverged",
      );
  }
}
