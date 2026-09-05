import { access, rename, unlink } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import {
  makeCancelSignal,
  openBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import type { Project } from "../types";
import type { JobExecution, JobResult } from "./jobs";
import type { StoredAsset, StudioStore } from "./storage";
import { HttpError, PREFIX, serveFile } from "./http";

export interface RenderConfig {
  bundleDir: string;
  browserExecutable?: string;
  timeoutMs: number;
  concurrency: number;
}

export async function detectBrowser(
  explicit?: string,
): Promise<string | undefined> {
  const candidates = explicit
    ? [explicit]
    : process.platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]
      : process.platform === "win32"
        ? [
            join(
              process.env.ProgramFiles ?? "C:\\Program Files",
              "Google/Chrome/Application/chrome.exe",
            ),
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
          ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* Try the next installed browser; never download during a cancellable job. */
    }
  }
  return undefined;
}

async function closeServer(server: Server): Promise<void> {
  const closed = new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  server.closeAllConnections();
  await closed;
}

/** One render can read only the uploaded assets captured in its immutable project. */
export async function createRenderMediaServer(
  assets: StoredAsset[],
): Promise<{ urls: Map<string, string>; close(): Promise<void> }> {
  const secret = randomBytes(32).toString("base64url");
  const allowed = new Map(assets.map((asset) => [asset.asset.id, asset]));
  const server = createServer((req, res) => {
    void (async () => {
      const port = (server.address() as AddressInfo).port;
      // Chromium's composition origin is a separate local port. It receives no
      // cookies; the unguessable job path and captured asset map grant read access.
      const address = req.socket.remoteAddress;
      if (
        !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address ?? "") ||
        req.headers.host !== `127.0.0.1:${port}`
      )
        throw new HttpError(403, "Forbidden");
      const path = new URL(req.url ?? "/", "http://localhost").pathname;
      const prefix = `/${secret}/`;
      const asset = path.startsWith(prefix)
        ? allowed.get(path.slice(prefix.length))
        : undefined;
      if (!asset) throw new HttpError(404, "Not found");
      res.setHeader("Access-Control-Allow-Origin", "*");
      await serveFile(req, res, asset.file);
    })().catch((error) => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      res.writeHead(error instanceof HttpError ? error.status : 404);
      res.end();
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
  const port = (server.address() as AddressInfo).port;
  return {
    urls: new Map(
      assets.map((asset) => [
        asset.asset.id,
        `http://127.0.0.1:${port}/${secret}/${asset.asset.id}`,
      ]),
    ),
    close: () => closeServer(server),
  };
}

/** Remotion exporter uses one isolated headless browser and an atomic output. */
export class RemotionExporter {
  constructor(
    private readonly config: RenderConfig,
    private readonly store: StudioStore,
  ) {}
  async available(): Promise<boolean> {
    try {
      await access(join(this.config.bundleDir, "index.html"));
      return (await detectBrowser(this.config.browserExecutable)) !== undefined;
    } catch {
      return false;
    }
  }
  async render(project: Project, execution: JobExecution): Promise<JobResult> {
    const browserExecutable = await detectBrowser(
      this.config.browserExecutable,
    );
    if (!browserExecutable)
      throw new HttpError(
        503,
        "未找到可用于导出的 Chrome；请配置 DSH_VIDEO_BROWSER_EXECUTABLE",
      );
    const records = await Promise.all(
      project.assets.map((asset) => this.store.asset(asset.id)),
    );
    execution.signal.throwIfAborted();
    const media = await createRenderMediaServer(records);
    const snapshot = structuredClone(project);
    snapshot.assets = snapshot.assets.map((asset) => ({
      ...asset,
      src: media.urls.get(asset.id)!,
    }));
    const signal = AbortSignal.any([
      execution.signal,
      AbortSignal.timeout(this.config.timeoutMs),
    ]);
    const { cancel, cancelSignal } = makeCancelSignal();
    let browser: Awaited<ReturnType<typeof openBrowser>> | undefined;
    let closing: Promise<void> | undefined;
    const closeBrowser = (): Promise<void> =>
      (closing ??= browser
        ? browser.close({ silent: true })
        : Promise.resolve());
    const aborted = (): void => {
      cancel();
      if (browser) void closeBrowser().catch(() => undefined);
    };
    signal.addEventListener("abort", aborted, { once: true });
    const output = this.store.exportPath(execution.id);
    const temporary = `${output}.partial.mp4`;
    try {
      signal.throwIfAborted();
      browser = await openBrowser("chrome", {
        browserExecutable,
        chromiumOptions: { headless: true },
        logLevel: "error",
      });
      signal.throwIfAborted();
      const inputProps = { project: snapshot };
      const composition = await selectComposition({
        serveUrl: this.config.bundleDir,
        id: "Studio",
        inputProps,
        puppeteerInstance: browser,
        timeoutInMilliseconds: 30_000,
        logLevel: "error",
      });
      signal.throwIfAborted();
      await renderMedia({
        composition,
        serveUrl: this.config.bundleDir,
        inputProps,
        codec: "h264",
        outputLocation: temporary,
        puppeteerInstance: browser,
        concurrency: this.config.concurrency,
        cancelSignal,
        timeoutInMilliseconds: 30_000,
        logLevel: "error",
        onProgress: ({ progress }) => execution.progress(progress),
      });
      signal.throwIfAborted();
      await rename(temporary, output);
      return { outputUrl: `${PREFIX}/exports/${execution.id}.mp4` };
    } finally {
      signal.removeEventListener("abort", aborted);
      await Promise.allSettled([
        closeBrowser(),
        media.close(),
        unlink(temporary),
      ]);
    }
  }
}
