import type { Context } from "@deepseek-ai/cordis";
import type { StudioRuntime } from "./host/runtime";

export const name = "video-studio-invariant";
export const inject = ["videoStudio"];

/** Check the independent queue reservation and public running-job observation. */
export function apply(ctx: Context): void {
  const runtime = ctx.get("videoStudio") as StudioRuntime;
  runtime.jobs.assertInvariant();
}
