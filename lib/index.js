import { dirname, resolve as resolve4 } from "node:path";
import { fileURLToPath } from "node:url";
import z4 from "@deepseek-ai/schemastery";
import { resolve as resolve3 } from "node:path";
import { homedir } from "node:os";
import { z as z3, ZodError } from "zod";
import { openAsBlob } from "node:fs";
import { z } from "zod";
import { constants, createReadStream } from "node:fs";
import { open, realpath } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
  status;
};
var PREFIX = "/video-studio";
var SAFE_ID = /^[a-zA-Z0-9_-]{1,100}$/;
function assertId(id2) {
  if (!SAFE_ID.test(id2))
    throw new HttpError(400, "\u65E0\u6548\u7684\u8D44\u6E90 ID");
  return id2;
}
function json(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
}
async function readJson(req, maxBytes = 8 * 1024 * 1024) {
  if (req.headers["content-type"]?.split(";")[0]?.trim() !== "application/json")
    throw new HttpError(415, "\u8BF7\u6C42\u9700\u8981 application/json");
  const chunks = [];
  let size = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    const bytes = Buffer.from(chunk);
    size += bytes.length;
    if (size > maxBytes) {
      req.resume();
      throw new HttpError(413, "\u8BF7\u6C42\u5185\u5BB9\u8FC7\u5927");
    }
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "JSON \u683C\u5F0F\u65E0\u6548");
  }
}
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".flac": "audio/flac",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};
var mimeType = (path) =>
  MIME[extname(path).toLowerCase()] ?? "application/octet-stream";
async function containedFile(root, relative) {
  const canonicalRoot = await realpath(root);
  const target = resolve(canonicalRoot, relative);
  if (!target.startsWith(canonicalRoot + sep))
    throw new HttpError(
      403,
      "\u8DEF\u5F84\u8D85\u51FA\u5141\u8BB8\u8303\u56F4",
    );
  const canonical = await realpath(target);
  if (!canonical.startsWith(canonicalRoot + sep))
    throw new HttpError(
      403,
      "\u8DEF\u5F84\u8D85\u51FA\u5141\u8BB8\u8303\u56F4",
    );
  return canonical;
}
async function serveFile(req, res, path, options = {}) {
  if (req.method !== "GET" && req.method !== "HEAD")
    throw new HttpError(405, "\u4EC5\u652F\u6301 GET / HEAD");
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await file.stat();
    if (!info.isFile())
      throw new HttpError(404, "\u6587\u4EF6\u4E0D\u5B58\u5728");
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    const range = req.headers.range;
    if (range !== void 0) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2]) || info.size === 0) {
        res.setHeader("Content-Range", "bytes */".concat(info.size));
        throw new HttpError(416, "\u65E0\u6548\u7684\u5A92\u4F53\u8303\u56F4");
      }
      if (!match[1]) {
        const suffix = Number(match[2]);
        start = Math.max(0, info.size - suffix);
      } else {
        start = Number(match[1]);
        if (match[2]) end = Math.min(end, Number(match[2]));
      }
      if (
        !Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start < 0 ||
        start > end ||
        start >= info.size
      ) {
        res.setHeader("Content-Range", "bytes */".concat(info.size));
        throw new HttpError(
          416,
          "\u5A92\u4F53\u8303\u56F4\u8D85\u51FA\u6587\u4EF6",
        );
      }
      status = 206;
      res.setHeader(
        "Content-Range",
        "bytes ".concat(start, "-").concat(end, "/").concat(info.size),
      );
    }
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", mimeType(path));
    res.setHeader("Content-Length", Math.max(0, end - start + 1));
    res.setHeader(
      "Cache-Control",
      options.immutable ? "private, max-age=31536000, immutable" : "no-cache",
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (options.download)
      res.setHeader(
        "Content-Disposition",
        "attachment; filename*=UTF-8''".concat(
          encodeURIComponent(options.download),
        ),
      );
    res.writeHead(status);
    if (req.method === "HEAD" || info.size === 0) {
      res.end();
      return;
    }
    await pipeline(
      createReadStream(path, { fd: file.fd, autoClose: false, start, end }),
      res,
    );
  } finally {
    await file.close();
  }
}
var segmentSchema = z
  .object({
    start: z.number().finite().nonnegative(),
    end: z.number().finite().positive(),
    text: z.string().max(1e4),
  })
  .refine((segment) => segment.end > segment.start);
function parseSegments(value) {
  return z
    .array(segmentSchema)
    .max(1e4)
    .parse(value)
    .filter((segment) => segment.text.trim())
    .sort((a, b) => a.start - b.start);
}
var AsrRegistry = class {
  constructor(selected) {
    this.selected = selected;
  }
  selected;
  providers = /* @__PURE__ */ new Map();
  register(provider) {
    if (this.providers.has(provider.id))
      throw new Error("ASR provider already registered: ".concat(provider.id));
    this.providers.set(provider.id, provider);
    return () => {
      if (this.providers.get(provider.id) === provider)
        this.providers.delete(provider.id);
    };
  }
  capabilities() {
    const provider = this.providers.get(this.selected);
    return {
      configured: provider !== void 0,
      provider: provider?.id ?? this.selected,
      ...(provider?.model ? { model: provider.model } : {}),
    };
  }
  resolve() {
    const provider = this.providers.get(this.selected);
    if (!provider)
      throw new HttpError(
        503,
        "ASR \u5C1A\u672A\u914D\u7F6E\uFF1A\u8BF7\u8BBE\u7F6E\u670D\u52A1\u5730\u5740\u3001\u6A21\u578B\u3001\u5E26\u65F6\u95F4\u6233\u7684\u8FD4\u56DE\u683C\u5F0F\u548C\u670D\u52A1\u7AEF API Key\uFF0C\u6216\u6CE8\u518C\u672C\u5730 provider",
      );
    return provider;
  }
  clear() {
    this.providers.clear();
  }
};
function openAiAsrProvider(config) {
  const endpoint = new URL(config.endpoint);
  if (
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    !["https:", "http:"].includes(endpoint.protocol)
  )
    throw new Error("ASR endpoint must be a clean HTTP(S) transcription URL");
  if (
    endpoint.protocol === "http:" &&
    !["127.0.0.1", "localhost", "[::1]"].includes(endpoint.hostname)
  )
    throw new Error("Remote ASR endpoint requires HTTPS");
  if (!config.model.trim() || !config.apiKey.trim())
    throw new Error("ASR model and API key are required");
  return {
    id: "openai-compatible",
    model: config.model,
    async transcribe({ asset, language, signal }) {
      if (asset.asset.kind === "image")
        throw new HttpError(
          400,
          "\u56FE\u7247\u4E0D\u5305\u542B\u53EF\u8F6C\u5F55\u7684\u97F3\u8F68",
        );
      if (asset.bytes > config.maxBytes)
        throw new HttpError(
          413,
          "\u7D20\u6750\u8D85\u8FC7 ASR \u670D\u52A1\u7684\u4E0A\u4F20\u9650\u5236\uFF1B\u8BF7\u5148\u538B\u7F29\u6216\u62C6\u5206\u97F3\u9891",
        );
      signal.throwIfAborted();
      const form = new FormData();
      form.set(
        "file",
        await openAsBlob(asset.file, { type: mimeType(asset.file) }),
        asset.asset.name,
      );
      form.set("model", config.model);
      form.set("response_format", config.format);
      if (config.format === "diarized_json")
        form.set("chunking_strategy", "auto");
      else form.append("timestamp_granularities[]", "segment");
      if (language) form.set("language", language);
      let response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: "Bearer ".concat(config.apiKey) },
          body: form,
          redirect: "error",
          signal: AbortSignal.any([
            signal,
            AbortSignal.timeout(config.timeoutMs),
          ]),
        });
      } catch {
        signal.throwIfAborted();
        throw new HttpError(
          502,
          "ASR \u670D\u52A1\u8FDE\u63A5\u5931\u8D25\u6216\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u914D\u7F6E",
        );
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new HttpError(
          502,
          "ASR \u670D\u52A1\u8FD4\u56DE HTTP ".concat(response.status),
        );
      }
      const reader = response.body?.getReader();
      if (!reader)
        throw new HttpError(
          502,
          "ASR \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9",
        );
      const parts = [];
      let total = 0;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > 8 * 1024 * 1024)
            throw new HttpError(
              502,
              "ASR \u8FD4\u56DE\u5185\u5BB9\u8D85\u8FC7\u9650\u5236",
            );
          parts.push(value);
        }
        const body = JSON.parse(Buffer.concat(parts).toString("utf8"));
        return parseSegments(body.segments);
      } catch (error) {
        signal.throwIfAborted();
        if (error instanceof HttpError) throw error;
        throw new HttpError(
          502,
          "ASR \u672A\u8FD4\u56DE\u6709\u6548\u7684 start / end / text \u65F6\u95F4\u7247\u6BB5\uFF0C\u8BF7\u6838\u5BF9\u6A21\u578B\u548C\u8FD4\u56DE\u683C\u5F0F",
        );
      } finally {
        await reader.cancel();
        reader.releaseLock();
      }
    },
  };
}
import { randomUUID } from "node:crypto";
var JobQueue = class {
  constructor(maxQueued = 16, maxRetained = 1e3) {
    this.maxQueued = maxQueued;
    this.maxRetained = maxRetained;
  }
  maxQueued;
  maxRetained;
  entries = /* @__PURE__ */ new Map();
  pending = [];
  active;
  disposed = false;
  enqueue(kind, task) {
    if (this.disposed)
      throw new HttpError(503, "\u5DE5\u4F5C\u53F0\u6B63\u5728\u5173\u95ED");
    if (this.pending.length + Number(this.active !== void 0) >= this.maxQueued)
      throw new HttpError(
        429,
        "\u4EFB\u52A1\u961F\u5217\u5DF2\u6EE1\uFF0C\u8BF7\u7B49\u5F85\u5F53\u524D\u4EFB\u52A1\u5B8C\u6210",
      );
    while (this.entries.size >= this.maxRetained) {
      const completed = [...this.entries].find(([, item]) =>
        ["completed", "failed", "cancelled"].includes(item.job.status),
      );
      if (!completed)
        throw new HttpError(429, "\u4EFB\u52A1\u8BB0\u5F55\u5DF2\u6EE1");
      this.entries.delete(completed[0]);
    }
    let settle;
    const done = new Promise((resolve5) => {
      settle = resolve5;
    });
    const entry = {
      job: {
        id: randomUUID(),
        kind,
        status: "queued",
        progress: 0,
        createdAt: /* @__PURE__ */ new Date().toISOString(),
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
  get(id2) {
    const entry = this.entries.get(id2);
    if (!entry)
      throw new HttpError(
        404,
        "\u4EFB\u52A1\u4E0D\u5B58\u5728\u6216\u5DF2\u8FC7\u671F",
      );
    return structuredClone(entry.job);
  }
  async cancel(id2) {
    const entry = this.entries.get(id2);
    if (!entry)
      throw new HttpError(
        404,
        "\u4EFB\u52A1\u4E0D\u5B58\u5728\u6216\u5DF2\u8FC7\u671F",
      );
    if (entry.job.status === "queued") {
      this.pending = this.pending.filter((item) => item !== entry);
      entry.abort.abort();
      entry.job.status = "cancelled";
      entry.settle();
    } else if (entry.job.status === "running") {
      entry.job.message = "\u6B63\u5728\u53D6\u6D88";
      entry.abort.abort();
      await entry.done;
    }
    return structuredClone(entry.job);
  }
  pump() {
    if (this.active || this.disposed) return;
    const entry = this.pending.shift();
    if (!entry) return;
    this.active = entry;
    entry.job.status = "running";
    void this.run(entry);
  }
  async run(entry) {
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
        ? "\u4EFB\u52A1\u5DF2\u53D6\u6D88"
        : error instanceof Error
          ? error.message.slice(0, 800)
          : "\u4EFB\u52A1\u6267\u884C\u5931\u8D25";
    } finally {
      this.active = void 0;
      entry.settle();
      this.pump();
    }
  }
  async dispose() {
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
  assertInvariant() {
    const running = [...this.entries.values()].filter(
      (entry) => entry.job.status === "running",
    );
    if (
      running.length !== Number(this.active !== void 0) ||
      (this.active && running[0] !== this.active)
    )
      throw new Error(
        "Video Studio queue reservation and running jobs diverged",
      );
  }
};
import { access, rename, unlink } from "node:fs/promises";
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import {
  makeCancelSignal,
  openBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
async function detectBrowser(explicit) {
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
    } catch {}
  }
  return void 0;
}
async function closeServer(server) {
  const closed = new Promise((resolve5, reject) =>
    server.close((error) => (error ? reject(error) : resolve5())),
  );
  server.closeAllConnections();
  await closed;
}
async function createRenderMediaServer(assets) {
  const secret = randomBytes(32).toString("base64url");
  const allowed = new Map(assets.map((asset) => [asset.asset.id, asset]));
  const server = createServer((req, res) => {
    void (async () => {
      const port2 = server.address().port;
      const address = req.socket.remoteAddress;
      if (
        !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address ?? "") ||
        req.headers.host !== "127.0.0.1:".concat(port2)
      )
        throw new HttpError(403, "Forbidden");
      const path = new URL(req.url ?? "/", "http://localhost").pathname;
      const prefix = "/".concat(secret, "/");
      const asset = path.startsWith(prefix)
        ? allowed.get(path.slice(prefix.length))
        : void 0;
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
  await new Promise((resolve5, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve5();
    });
  });
  const port = server.address().port;
  return {
    urls: new Map(
      assets.map((asset) => [
        asset.asset.id,
        "http://127.0.0.1:"
          .concat(port, "/")
          .concat(secret, "/")
          .concat(asset.asset.id),
      ]),
    ),
    close: () => closeServer(server),
  };
}
var RemotionExporter = class {
  constructor(config, store) {
    this.config = config;
    this.store = store;
  }
  config;
  store;
  async available() {
    try {
      await access(join(this.config.bundleDir, "index.html"));
      return (await detectBrowser(this.config.browserExecutable)) !== void 0;
    } catch {
      return false;
    }
  }
  async render(project, execution) {
    const browserExecutable = await detectBrowser(
      this.config.browserExecutable,
    );
    if (!browserExecutable)
      throw new HttpError(
        503,
        "\u672A\u627E\u5230\u53EF\u7528\u4E8E\u5BFC\u51FA\u7684 Chrome\uFF1B\u8BF7\u914D\u7F6E DSH_VIDEO_BROWSER_EXECUTABLE",
      );
    const records = await Promise.all(
      project.assets.map((asset) => this.store.asset(asset.id)),
    );
    execution.signal.throwIfAborted();
    const media = await createRenderMediaServer(records);
    const snapshot = structuredClone(project);
    snapshot.assets = snapshot.assets.map((asset) => ({
      ...asset,
      src: media.urls.get(asset.id),
    }));
    const signal = AbortSignal.any([
      execution.signal,
      AbortSignal.timeout(this.config.timeoutMs),
    ]);
    const { cancel, cancelSignal } = makeCancelSignal();
    let browser;
    let closing;
    const closeBrowser = () =>
      (closing ??= browser
        ? browser.close({ silent: true })
        : Promise.resolve());
    const aborted = () => {
      cancel();
      if (browser) void closeBrowser().catch(() => void 0);
    };
    signal.addEventListener("abort", aborted, { once: true });
    const output = this.store.exportPath(execution.id);
    const temporary = "".concat(output, ".partial.mp4");
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
        timeoutInMilliseconds: 3e4,
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
        timeoutInMilliseconds: 3e4,
        logLevel: "error",
        onProgress: ({ progress }) => execution.progress(progress),
      });
      signal.throwIfAborted();
      await rename(temporary, output);
      return {
        outputUrl: "".concat(PREFIX, "/exports/").concat(execution.id, ".mp4"),
      };
    } finally {
      signal.removeEventListener("abort", aborted);
      await Promise.allSettled([
        closeBrowser(),
        media.close(),
        unlink(temporary),
      ]);
    }
  }
};
import { constants as constants2 } from "node:fs";
import {
  mkdir,
  open as open2,
  readFile,
  readdir,
  rename as rename2,
  unlink as unlink2,
} from "node:fs/promises";
import { randomUUID as randomUUID2 } from "node:crypto";
import {
  extname as extname2,
  join as join2,
  resolve as resolve2,
} from "node:path";
import { z as z2 } from "zod";
var frame = z2
  .number()
  .int()
  .nonnegative()
  .max(30 * 60 * 120);
var id = z2.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
var assetSchema = z2.object({
  id,
  name: z2.string().min(1).max(240),
  kind: z2.enum(["video", "audio", "image"]),
  src: z2.string().max(2048),
  duration: z2.number().positive().max(3600),
  width: z2.number().positive().optional(),
  height: z2.number().positive().optional(),
  waveform: z2.array(z2.number().min(0).max(1)).max(512).optional(),
});
var clipSchema = z2.object({
  id,
  trackId: z2.enum(["video", "titles", "captions", "audio"]),
  kind: z2.enum(["media", "title", "caption"]),
  name: z2.string().max(240),
  assetId: id.optional(),
  start: frame,
  duration: frame.min(1),
  sourceStart: frame,
  text: z2.string().max(1e4),
  motion: z2.enum(["none", "fade", "rise", "drift"]),
  volume: z2.number().min(0).max(2),
  opacity: z2.number().min(0).max(1),
  scale: z2.number().min(0.1).max(4),
  x: z2.number().min(-100).max(100),
  y: z2.number().min(-100).max(100),
  fontSize: z2.number().min(12).max(200),
  tone: z2.enum(["clay", "sage", "ink"]),
});
var projectSchema = z2
  .object({
    version: z2.literal(1),
    id,
    name: z2.string().min(1).max(240),
    fps: z2.union([
      z2.literal(24),
      z2.literal(25),
      z2.literal(30),
      z2.literal(60),
    ]),
    width: z2
      .number()
      .int()
      .min(240)
      .max(3840)
      .refine((n) => n % 2 === 0),
    height: z2
      .number()
      .int()
      .min(240)
      .max(3840)
      .refine((n) => n % 2 === 0),
    assets: z2.array(assetSchema).max(500),
    clips: z2.array(clipSchema).max(3e3),
    updatedAt: z2.string().datetime(),
  })
  .superRefine((project, ctx) => {
    const ids = /* @__PURE__ */ new Set();
    for (const item of [...project.assets, ...project.clips]) {
      if (ids.has(item.id))
        ctx.addIssue({
          code: "custom",
          message: "\u7D20\u6750\u4E0E\u7247\u6BB5 ID \u5FC5\u987B\u552F\u4E00",
        });
      ids.add(item.id);
    }
    for (const clip of project.clips) {
      const asset = project.assets.find((item) => item.id === clip.assetId);
      if (clip.kind === "media" && !asset)
        ctx.addIssue({
          code: "custom",
          message: "\u7247\u6BB5 ".concat(
            clip.name,
            " \u5F15\u7528\u4E86\u7F3A\u5931\u7684\u7D20\u6750",
          ),
        });
      if (
        clip.kind === "media" &&
        asset &&
        asset.kind !== "image" &&
        clip.sourceStart + clip.duration >
          Math.max(1, Math.floor(asset.duration * project.fps))
      )
        ctx.addIssue({
          code: "custom",
          message: "\u7247\u6BB5 ".concat(
            clip.name,
            " \u8D85\u51FA\u4E86\u6E90\u7D20\u6750\u65F6\u957F",
          ),
        });
      if (clip.start + clip.duration > project.fps * 1800)
        ctx.addIssue({
          code: "custom",
          message:
            "\u5F53\u524D\u5355\u5DE5\u7A0B\u6700\u957F\u652F\u6301 30 \u5206\u949F",
        });
      if (
        clip.kind === "media" &&
        asset &&
        (asset.kind === "audio"
          ? clip.trackId !== "audio"
          : clip.trackId !== "video")
      )
        ctx.addIssue({
          code: "custom",
          message:
            "\u7D20\u6750\u4E0E\u8F68\u9053\u7C7B\u578B\u4E0D\u5339\u914D",
        });
      if (
        (clip.kind === "title" && clip.trackId !== "titles") ||
        (clip.kind === "caption" && clip.trackId !== "captions")
      )
        ctx.addIssue({
          code: "custom",
          message:
            "\u6587\u5B57\u4E0E\u8F68\u9053\u7C7B\u578B\u4E0D\u5339\u914D",
        });
    }
  });
var MAX_UPLOAD_BYTES = 250 * 1024 * 1024;
var EXTENSIONS = {
  image: /* @__PURE__ */ new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".avif",
    ".gif",
  ]),
  video: /* @__PURE__ */ new Set([".mp4", ".webm", ".mov", ".m4v"]),
  audio: /* @__PURE__ */ new Set([
    ".mp3",
    ".m4a",
    ".wav",
    ".ogg",
    ".flac",
    ".webm",
  ]),
};
async function removeIfPresent(path) {
  try {
    await unlink2(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
async function atomicJson(path, value) {
  const temporary = "".concat(path, ".").concat(randomUUID2(), ".tmp");
  try {
    const file = await open2(temporary, "wx", 384);
    try {
      await file.writeFile(JSON.stringify(value));
      await file.sync();
    } finally {
      await file.close();
    }
    await rename2(temporary, path);
  } finally {
    await removeIfPresent(temporary);
  }
}
var StudioStore = class {
  root;
  writes = Promise.resolve();
  constructor(dataDir) {
    this.root = resolve2(dataDir);
  }
  async init() {
    await Promise.all(
      ["projects", "assets", "exports"].map((dir) =>
        mkdir(join2(this.root, dir), { recursive: true, mode: 448 }),
      ),
    );
  }
  exportPath(id2) {
    return join2(this.root, "exports", "".concat(assertId(id2), ".mp4"));
  }
  async asset(id2) {
    const raw = JSON.parse(
      await readFile(
        join2(this.root, "assets", "".concat(assertId(id2), ".json")),
        "utf8",
      ),
    );
    if (!raw || typeof raw !== "object")
      throw new HttpError(500, "\u7D20\u6750\u8BB0\u5F55\u635F\u574F");
    const record = raw;
    const asset = assetSchema.parse(record.asset);
    if (
      asset.id !== id2 ||
      typeof record.extension !== "string" ||
      !EXTENSIONS[asset.kind].has(record.extension) ||
      !Number.isSafeInteger(record.bytes) ||
      Number(record.bytes) <= 0
    )
      throw new HttpError(500, "\u7D20\u6750\u8BB0\u5F55\u635F\u574F");
    const file = join2(
      this.root,
      "assets",
      "".concat(id2).concat(record.extension),
    );
    const handle = await open2(
      file,
      constants2.O_RDONLY | constants2.O_NOFOLLOW,
    );
    try {
      if (!(await handle.stat()).isFile())
        throw new HttpError(404, "\u7D20\u6750\u4E0D\u5B58\u5728");
    } finally {
      await handle.close();
    }
    return {
      asset: { ...asset, src: "".concat(PREFIX, "/media/").concat(id2) },
      file,
      bytes: Number(record.bytes),
    };
  }
  async canonicalProject(value) {
    const project = projectSchema.parse(value);
    const assets = await Promise.all(
      project.assets.map(async (asset) => {
        const stored = await this.asset(asset.id);
        if (asset.src !== stored.asset.src || asset.kind !== stored.asset.kind)
          throw new HttpError(
            400,
            "\u5DE5\u7A0B\u53EA\u80FD\u5F15\u7528\u672C\u5DE5\u4F5C\u53F0\u5DF2\u5BFC\u5165\u7684\u7D20\u6750",
          );
        return {
          ...stored.asset,
          name: asset.name,
          ...(asset.waveform ? { waveform: asset.waveform } : {}),
        };
      }),
    );
    return projectSchema.parse({ ...project, assets });
  }
  async projects() {
    await this.writes;
    const files = (await readdir(join2(this.root, "projects"))).filter(
      (file) => file.endsWith(".json") && SAFE_ID.test(file.slice(0, -5)),
    );
    const projects = await Promise.all(
      files.map(async (file) =>
        projectSchema.parse(
          JSON.parse(
            await readFile(join2(this.root, "projects", file), "utf8"),
          ),
        ),
      ),
    );
    return projects.sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    );
  }
  saveProject(id2, value) {
    assertId(id2);
    const snapshot = structuredClone(value);
    const write = this.writes.then(async () => {
      const project = await this.canonicalProject(snapshot);
      if (project.id !== id2)
        throw new HttpError(
          400,
          "\u5DE5\u7A0B ID \u4E0E\u8DEF\u5F84\u4E0D\u4E00\u81F4",
        );
      const committed = {
        ...project,
        updatedAt: /* @__PURE__ */ new Date().toISOString(),
      };
      await atomicJson(
        join2(this.root, "projects", "".concat(id2, ".json")),
        committed,
      );
      return committed;
    });
    this.writes = write.then(
      () => void 0,
      () => void 0,
    );
    return write;
  }
  async upload(req, query, signal, maxBytes = MAX_UPLOAD_BYTES) {
    const name2 = query.get("name") ?? "";
    const kind = query.get("kind");
    const extension = extname2(name2).toLowerCase();
    if (
      name2.length === 0 ||
      name2.length > 240 ||
      !EXTENSIONS[kind]?.has(extension)
    )
      throw new HttpError(
        415,
        "\u8BF7\u9009\u62E9\u652F\u6301\u7684\u89C6\u9891\u3001\u97F3\u9891\u6216\u56FE\u7247\u683C\u5F0F",
      );
    const asset = assetSchema.parse({
      id: randomUUID2(),
      name: name2,
      kind,
      src: "",
      duration: Number(query.get("duration")),
      ...(query.has("width") ? { width: Number(query.get("width")) } : {}),
      ...(query.has("height") ? { height: Number(query.get("height")) } : {}),
    });
    asset.src = "".concat(PREFIX, "/media/").concat(asset.id);
    const declared = req.headers["content-length"];
    if (declared && Number(declared) > maxBytes)
      throw new HttpError(
        413,
        "\u7D20\u6750\u8D85\u8FC7\u4E0A\u4F20\u5927\u5C0F\u9650\u5236",
      );
    const target = join2(
      this.root,
      "assets",
      "".concat(asset.id).concat(extension),
    );
    const temporary = "".concat(target, ".upload");
    const file = await open2(temporary, "wx", 384);
    const abort = () => {
      req.destroy(new Error("Upload cancelled"));
    };
    signal.addEventListener("abort", abort, { once: true });
    let size = 0;
    let published = false;
    try {
      signal.throwIfAborted();
      for await (const chunk of req.iterator({ destroyOnReturn: false })) {
        signal.throwIfAborted();
        const bytes = Buffer.from(chunk);
        size += bytes.length;
        if (size > maxBytes) {
          req.resume();
          throw new HttpError(
            413,
            "\u7D20\u6750\u8D85\u8FC7\u4E0A\u4F20\u5927\u5C0F\u9650\u5236",
          );
        }
        await file.writeFile(bytes);
      }
      if (size === 0)
        throw new HttpError(400, "\u7D20\u6750\u6587\u4EF6\u4E3A\u7A7A");
      await file.sync();
      await file.close();
      signal.throwIfAborted();
      await rename2(temporary, target);
      await atomicJson(
        join2(this.root, "assets", "".concat(asset.id, ".json")),
        {
          asset,
          extension,
          bytes: size,
        },
      );
      signal.throwIfAborted();
      published = true;
      return asset;
    } finally {
      signal.removeEventListener("abort", abort);
      await file.close();
      await removeIfPresent(temporary);
      if (!published) {
        await removeIfPresent(target);
        await removeIfPresent(
          join2(this.root, "assets", "".concat(asset.id, ".json")),
        );
      }
    }
  }
  async dispose() {
    await this.writes;
  }
};
var configSchema = z3.object({
  dataDir: z3.string().min(1),
  browserExecutable: z3.string().optional(),
  renderConcurrency: z3.number().int().min(1).max(8),
  renderTimeoutMs: z3.number().int().min(1e3).max(36e5),
  maxUploadBytes: z3.number().int().min(1).max(MAX_UPLOAD_BYTES),
  maxQueuedJobs: z3.number().int().min(1).max(100),
  asrProvider: z3.string().min(1),
  asrEndpoint: z3.string().optional(),
  asrModel: z3.string().optional(),
  asrFormat: z3.enum(["diarized_json", "verbose_json"]).optional(),
  asrApiKeyEnv: z3.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
  asrTimeoutMs: z3.number().int().min(1e3).max(36e5),
  asrMaxBytes: z3.number().int().min(1).max(MAX_UPLOAD_BYTES),
});
function resolveStudioConfig(config = {}, env = process.env) {
  return configSchema.parse({
    dataDir:
      config.dataDir ??
      env.DSH_VIDEO_DATA_DIR ??
      resolve3(homedir(), ".dsh/video-studio"),
    browserExecutable:
      config.browserExecutable ?? env.DSH_VIDEO_BROWSER_EXECUTABLE,
    renderConcurrency: config.renderConcurrency ?? 2,
    renderTimeoutMs: config.renderTimeoutMs ?? 15 * 6e4,
    maxUploadBytes: config.maxUploadBytes ?? MAX_UPLOAD_BYTES,
    maxQueuedJobs: config.maxQueuedJobs ?? 16,
    asrProvider:
      config.asrProvider ?? env.DSH_VIDEO_ASR_PROVIDER ?? "openai-compatible",
    asrEndpoint: config.asrEndpoint ?? env.DSH_VIDEO_ASR_ENDPOINT,
    asrModel: config.asrModel ?? env.DSH_VIDEO_ASR_MODEL,
    asrFormat: config.asrFormat ?? env.DSH_VIDEO_ASR_FORMAT,
    asrApiKeyEnv: config.asrApiKeyEnv ?? "DSH_VIDEO_ASR_API_KEY",
    asrTimeoutMs: config.asrTimeoutMs ?? 10 * 6e4,
    asrMaxBytes: config.asrMaxBytes ?? 25 * 1024 * 1024,
  });
}
var StudioRuntime = class {
  constructor(options) {
    this.options = options;
    this.config = resolveStudioConfig(options.config);
    this.store = new StudioStore(this.config.dataDir);
    this.jobs = new JobQueue(this.config.maxQueuedJobs);
    this.asr = new AsrRegistry(this.config.asrProvider);
    const apiKey = process.env[this.config.asrApiKeyEnv];
    if (
      this.config.asrEndpoint &&
      this.config.asrModel &&
      this.config.asrFormat &&
      apiKey
    )
      this.asr.register(
        openAiAsrProvider({
          endpoint: this.config.asrEndpoint,
          model: this.config.asrModel,
          format: this.config.asrFormat,
          apiKey,
          timeoutMs: this.config.asrTimeoutMs,
          maxBytes: this.config.asrMaxBytes,
        }),
      );
    this.exporter = new RemotionExporter(
      {
        bundleDir: options.remotionDir,
        browserExecutable: this.config.browserExecutable,
        timeoutMs: this.config.renderTimeoutMs,
        concurrency: this.config.renderConcurrency,
      },
      this.store,
    );
  }
  options;
  store;
  jobs;
  asr;
  exporter;
  config;
  shutdown = new AbortController();
  requests = /* @__PURE__ */ new Set();
  async init() {
    await this.store.init();
  }
  async capabilities() {
    return {
      asr: this.asr.capabilities(),
      render: { available: await this.exporter.available() },
      maxUploadBytes: this.config.maxUploadBytes,
    };
  }
  handle = (req, res) => {
    const abort = () => {
      req.destroy();
      res.destroy();
    };
    this.shutdown.signal.addEventListener("abort", abort, { once: true });
    const operation = this.dispatch(req, res).catch((error) => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      const code = error.code;
      const status =
        error instanceof HttpError
          ? error.status
          : error instanceof ZodError ||
              error instanceof URIError ||
              error instanceof SyntaxError
            ? 400
            : ["ENOENT", "ENOTDIR", "ELOOP"].includes(code ?? "")
              ? 404
              : 500;
      const message =
        error instanceof HttpError
          ? error.message
          : error instanceof ZodError
            ? error.issues
                .map((issue) => issue.message)
                .slice(0, 3)
                .join("\uFF1B")
            : status === 404
              ? "\u8D44\u6E90\u4E0D\u5B58\u5728"
              : status === 400
                ? "\u8BF7\u6C42\u683C\u5F0F\u65E0\u6548"
                : "\u5DE5\u4F5C\u53F0\u5904\u7406\u8BF7\u6C42\u5931\u8D25";
      json(res, status, { error: message });
    });
    this.requests.add(operation);
    void operation.finally(() => {
      this.requests.delete(operation);
      this.shutdown.signal.removeEventListener("abort", abort);
    });
    return operation;
  };
  async dispatch(req, res) {
    const rejection = this.options.authorize(req);
    if (rejection !== void 0)
      throw new HttpError(
        rejection,
        rejection === 401
          ? "\u8BF7\u5148\u767B\u5F55 DSH"
          : "\u8BF7\u6C42\u6765\u6E90\u672A\u83B7\u5141\u8BB8",
      );
    if (this.shutdown.signal.aborted)
      throw new HttpError(503, "\u5DE5\u4F5C\u53F0\u6B63\u5728\u5173\u95ED");
    const raw = req.url ?? "/";
    if (/%(?:2f|5c|00)/i.test(raw.split("?")[0] ?? "") || raw.includes("\\"))
      throw new HttpError(400, "\u8DEF\u5F84\u683C\u5F0F\u65E0\u6548");
    const url = new URL(raw, "http://localhost");
    const path = decodeURIComponent(url.pathname);
    if (path !== PREFIX && !path.startsWith("".concat(PREFIX, "/")))
      throw new HttpError(404, "\u8D44\u6E90\u4E0D\u5B58\u5728");
    const route = path.slice(PREFIX.length);
    const method = req.method;
    if (route === "/api/capabilities" && method === "GET") {
      json(res, 200, await this.capabilities());
      return;
    }
    if (route === "/api/projects" && method === "GET") {
      json(res, 200, await this.store.projects());
      return;
    }
    const projectMatch = /^\/api\/projects\/([^/]+)$/.exec(route);
    if (projectMatch && method === "PUT") {
      json(
        res,
        200,
        await this.store.saveProject(
          assertId(projectMatch[1]),
          await readJson(req),
        ),
      );
      return;
    }
    if (route === "/api/assets" && method === "POST") {
      json(
        res,
        201,
        await this.store.upload(
          req,
          url.searchParams,
          this.shutdown.signal,
          this.config.maxUploadBytes,
        ),
      );
      return;
    }
    if (route === "/api/render" && method === "POST") {
      const body = z3
        .object({ project: z3.unknown() })
        .parse(await readJson(req));
      const snapshot = await this.store.canonicalProject(body.project);
      if (!snapshot.clips.length)
        throw new HttpError(
          400,
          "\u8BF7\u5148\u5728\u65F6\u95F4\u7EBF\u4E0A\u6DFB\u52A0\u5185\u5BB9",
        );
      if (!(await this.exporter.available()))
        throw new HttpError(
          503,
          "\u5BFC\u51FA\u73AF\u5883\u672A\u5C31\u7EEA\uFF0C\u8BF7\u6784\u5EFA Remotion \u573A\u666F\u5E76\u914D\u7F6E\u53EF\u7528\u7684 Chrome",
        );
      json(
        res,
        202,
        this.jobs.enqueue("render", (execution) =>
          this.exporter.render(snapshot, execution),
        ),
      );
      return;
    }
    if (route === "/api/asr" && method === "POST") {
      const body = z3
        .object({
          assetId: z3.string(),
          language: z3
            .string()
            .regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/)
            .optional(),
        })
        .parse(await readJson(req));
      const provider = this.asr.resolve();
      const asset = await this.store.asset(body.assetId);
      if (asset.asset.kind === "image")
        throw new HttpError(
          400,
          "\u56FE\u7247\u4E0D\u5305\u542B\u53EF\u8F6C\u5F55\u7684\u97F3\u8F68",
        );
      json(
        res,
        202,
        this.jobs.enqueue("asr", async ({ signal }) => {
          const segments = parseSegments(
            await provider.transcribe({
              asset,
              language: body.language,
              signal,
            }),
          );
          if (
            segments.length > 3e3 ||
            segments.some((segment) => segment.end > asset.asset.duration + 0.1)
          )
            throw new HttpError(
              502,
              "ASR \u65F6\u95F4\u7247\u6BB5\u8D85\u8FC7\u6E90\u7D20\u6750\u65F6\u957F\u6216\u5DE5\u7A0B\u5BB9\u91CF",
            );
          return { segments };
        }),
      );
      return;
    }
    const jobMatch = /^\/api\/jobs\/([^/]+)(\/cancel)?$/.exec(route);
    if (jobMatch && method === "GET" && !jobMatch[2]) {
      json(res, 200, this.jobs.get(assertId(jobMatch[1])));
      return;
    }
    if (jobMatch && method === "POST" && jobMatch[2]) {
      json(res, 200, await this.jobs.cancel(assertId(jobMatch[1])));
      return;
    }
    const assetMatch = /^\/media\/([^/]+)$/.exec(route);
    if (assetMatch) {
      await serveFile(
        req,
        res,
        (await this.store.asset(assertId(assetMatch[1]))).file,
        { immutable: true },
      );
      return;
    }
    const exportMatch = /^\/exports\/([^/]+)\.mp4$/.exec(route);
    if (exportMatch) {
      await serveFile(
        req,
        res,
        this.store.exportPath(assertId(exportMatch[1])),
        { download: "Video-Studio-".concat(exportMatch[1], ".mp4") },
      );
      return;
    }
    if (route.startsWith("/api/"))
      throw new HttpError(
        405,
        "\u63A5\u53E3\u6216\u8BF7\u6C42\u65B9\u6CD5\u4E0D\u53D7\u652F\u6301",
      );
    if (method !== "GET" && method !== "HEAD")
      throw new HttpError(405, "\u4EC5\u652F\u6301 GET / HEAD");
    const relative =
      route === "" || route === "/" ? "index.html" : route.slice(1);
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    await serveFile(
      req,
      res,
      await containedFile(this.options.studioDir, relative),
    );
  }
  async dispose() {
    this.shutdown.abort();
    await this.jobs.dispose();
    await Promise.allSettled([...this.requests]);
    await this.store.dispose();
    this.asr.clear();
  }
};
var name = "video-studio";
var inject = ["webServer", "connection"];
var Config = z4.object({
  dataDir: z4.string(),
  browserExecutable: z4.string(),
  renderConcurrency: z4.natural().min(1).max(8),
  renderTimeoutMs: z4.natural().min(1e3),
  maxUploadBytes: z4.natural().min(1),
  maxQueuedJobs: z4.natural().min(1),
  asrProvider: z4.string(),
  asrEndpoint: z4.string(),
  asrModel: z4.string(),
  asrFormat: z4.union([z4.const("diarized_json"), z4.const("verbose_json")]),
  asrApiKeyEnv: z4.string(),
  asrTimeoutMs: z4.natural().min(1e3),
  asrMaxBytes: z4.natural().min(1),
});
async function apply(ctx, config = {}) {
  const lib = dirname(fileURLToPath(import.meta.url));
  const webServer = ctx.get("webServer");
  const connection = ctx.get("connection");
  const runtime = new StudioRuntime({
    config,
    studioDir: resolve4(lib, "studio"),
    remotionDir: resolve4(lib, "remotion"),
    authorize: (req) => connection.requestRejection(req),
  });
  await runtime.init();
  ctx.effect(() => {
    const unprovide = ctx.reflect.provide("videoStudio", runtime);
    const unprovideAsr = ctx.reflect.provide("videoStudioAsr", runtime.asr);
    let unregister;
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
export { Config, apply, inject, name };
