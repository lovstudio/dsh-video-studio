import { constants, createReadStream } from "node:fs";
import { open, realpath } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";

/** An expected request failure whose message is safe to show to the editor. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const PREFIX = "/video-studio";
export const SAFE_ID = /^[a-zA-Z0-9_-]{1,100}$/;

export function assertId(id: string): string {
  if (!SAFE_ID.test(id)) throw new HttpError(400, "无效的资源 ID");
  return id;
}

export function json(
  res: ServerResponse,
  status: number,
  value: unknown,
): void {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
}

export async function readJson(
  req: IncomingMessage,
  maxBytes = 8 * 1024 * 1024,
): Promise<unknown> {
  if (req.headers["content-type"]?.split(";")[0]?.trim() !== "application/json")
    throw new HttpError(415, "请求需要 application/json");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    const bytes = Buffer.from(chunk as Uint8Array);
    size += bytes.length;
    if (size > maxBytes) {
      req.resume();
      throw new HttpError(413, "请求内容过大");
    }
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "JSON 格式无效");
  }
}

const MIME: Record<string, string> = {
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
export const mimeType = (path: string): string =>
  MIME[extname(path).toLowerCase()] ?? "application/octet-stream";

/** Resolve a static path without allowing symlink or traversal escapes. */
export async function containedFile(
  root: string,
  relative: string,
): Promise<string> {
  const canonicalRoot = await realpath(root);
  const target = resolve(canonicalRoot, relative);
  if (!target.startsWith(canonicalRoot + sep))
    throw new HttpError(403, "路径超出允许范围");
  const canonical = await realpath(target);
  if (!canonical.startsWith(canonicalRoot + sep))
    throw new HttpError(403, "路径超出允许范围");
  return canonical;
}

/** Serve one owner-selected file with byte ranges; callers own authentication. */
export async function serveFile(
  req: IncomingMessage,
  res: ServerResponse,
  path: string,
  options: { download?: string; immutable?: boolean } = {},
): Promise<void> {
  if (req.method !== "GET" && req.method !== "HEAD")
    throw new HttpError(405, "仅支持 GET / HEAD");
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await file.stat();
    if (!info.isFile()) throw new HttpError(404, "文件不存在");
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    const range = req.headers.range;
    if (range !== undefined) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2]) || info.size === 0) {
        res.setHeader("Content-Range", `bytes */${info.size}`);
        throw new HttpError(416, "无效的媒体范围");
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
        res.setHeader("Content-Range", `bytes */${info.size}`);
        throw new HttpError(416, "媒体范围超出文件");
      }
      status = 206;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${info.size}`);
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
        `attachment; filename*=UTF-8''${encodeURIComponent(options.download)}`,
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

/** Only the exact developer origin can reach its loopback server. */
export function devRequestRejection(
  req: IncomingMessage,
  port: number,
): number | undefined {
  if (
    !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
      req.socket.remoteAddress ?? "",
    )
  )
    return 403;
  const hosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
  if (!hosts.has(req.headers.host ?? "")) return 403;
  if (
    req.headers.origin !== undefined &&
    req.headers.origin !== `http://${req.headers.host}`
  )
    return 403;
  if (req.headers["sec-fetch-site"] === "cross-site") return 403;
  return undefined;
}
