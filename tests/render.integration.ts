import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  getVideoMetadata,
  makeCancelSignal,
  openBrowser,
  RenderInternals,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { createClip, createProject, projectSchema } from "../src/core/project";
import { detectBrowser, RemotionExporter } from "../src/host/render";
import { StudioStore } from "../src/host/storage";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bundleDir = join(packageRoot, "lib/remotion");

test(
  "real Chrome exports an atomic H.264 movie and renders frame 15 → 0 → 15 deterministically",
  { timeout: 120_000 },
  async (context) => {
    await access(join(bundleDir, "index.html")).catch(() => {
      throw new Error(
        "Missing lib/remotion/index.html; run pnpm build before pnpm test:render.",
      );
    });
    const browserExecutable = await detectBrowser(
      process.env.DSH_VIDEO_BROWSER_EXECUTABLE,
    );
    if (!browserExecutable) {
      context.skip(
        "Chrome/Chromium is unavailable; configure DSH_VIDEO_BROWSER_EXECUTABLE to run the real renderer test.",
      );
      return;
    }

    const root = await mkdtemp(join(tmpdir(), "dsh-video-render-integration-"));
    const store = new StudioStore(join(root, "data"));
    let browser: Awaited<ReturnType<typeof openBrowser>> | undefined;
    context.after(async () => {
      try {
        if (browser) await browser.close({ silent: true });
      } finally {
        try {
          await store.dispose();
        } finally {
          await rm(root, { recursive: true, force: true });
        }
      }
    });
    await store.init();
    const project = projectSchema.parse({
      ...createProject(false),
      name: "Deterministic title integration",
      width: 426,
      height: 240,
      fps: 30,
      clips: [
        createClip({
          duration: 24,
          motion: "rise",
          text: "每一帧，都有表达。",
          fontSize: 110,
        }),
      ],
    });

    const exporter = new RemotionExporter(
      { bundleDir, browserExecutable, concurrency: 1, timeoutMs: 60_000 },
      store,
    );
    const id = "integration-title";
    const result = await exporter.render(project, {
      id,
      signal: context.signal,
      progress: () => undefined,
    });
    assert.equal(result.outputUrl, `/video-studio/exports/${id}.mp4`);
    const output = store.exportPath(id);
    assert.ok(
      (await stat(output)).size > 1024,
      "The published MP4 must contain encoded video",
    );
    assert.deepEqual(
      await readdir(join(store.root, "exports")),
      [`${id}.mp4`],
      "Only the final export should remain after publishing",
    );

    const metadata = await getVideoMetadata(output, { logLevel: "error" });
    assert.equal(metadata.codec, "h264");
    assert.equal(metadata.width, 426);
    assert.equal(metadata.height, 240);
    assert.equal(metadata.fps, 30);
    // AAC padding can extend container duration; count decoded video frames instead.
    const probe = await RenderInternals.callFf({
      bin: "ffprobe",
      args: [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-count_frames",
        "-show_entries",
        "stream=nb_read_frames",
        "-of",
        "json",
        output,
      ],
      indent: false,
      logLevel: "error",
      binariesDirectory: null,
      cancelSignal: undefined,
      options: { timeout: 10_000 },
    });
    const decoded = JSON.parse(probe.stdout) as {
      streams: { nb_read_frames?: string }[];
    };
    assert.equal(decoded.streams.length, 1);
    assert.equal(
      Number(decoded.streams[0].nb_read_frames),
      24,
      "MP4 must contain exactly 24 decoded video frames",
    );
    context.diagnostic(
      `Published H.264: ${metadata.width} × ${metadata.height}, ${metadata.fps} fps, 24 frames`,
    );

    browser = await openBrowser("chrome", {
      browserExecutable,
      chromiumOptions: { headless: true },
      logLevel: "error",
    });
    const inputProps = { project };
    const composition = await selectComposition({
      serveUrl: bundleDir,
      id: "Studio",
      inputProps,
      puppeteerInstance: browser,
      timeoutInMilliseconds: 30_000,
      logLevel: "error",
    });
    const { cancel, cancelSignal } = makeCancelSignal();
    context.signal.addEventListener("abort", cancel, { once: true });
    context.after(() => context.signal.removeEventListener("abort", cancel));
    const hashes: string[] = [];
    // renderStill owns each page; the browser is shared across non-monotonic render requests.
    for (const frame of [15, 0, 15]) {
      const still = await renderStill({
        serveUrl: bundleDir,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame,
        imageFormat: "png",
        output: null,
        cancelSignal,
        timeoutInMilliseconds: 30_000,
        logLevel: "error",
      });
      assert.ok(
        still.buffer && still.buffer.byteLength > 100,
        `Frame ${frame} must contain an image`,
      );
      hashes.push(createHash("sha256").update(still.buffer).digest("hex"));
    }
    assert.notEqual(
      hashes[0],
      hashes[1],
      "Animated title must visibly change between frames 0 and 15",
    );
    assert.equal(
      hashes[0],
      hashes[2],
      "Frame 15 must be identical before and after rendering an earlier frame",
    );
    context.diagnostic(`Frame 15 SHA-256: ${hashes[0]}`);
  },
);
