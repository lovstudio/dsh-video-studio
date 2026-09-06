import { constants } from "node:fs";
import {
  mkdir,
  lstat,
  open,
  readFile,
  readdir,
  rename,
  unlink,
} from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import type { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
import { extname, join, resolve } from "node:path";
import { assetSchema, projectSchema } from "../core/project";
import type { Asset, AssetKind, Project } from "../types";
import { assertId, HttpError, PREFIX, SAFE_ID } from "./http";

export const MAX_UPLOAD_BYTES = 250 * 1024 * 1024;
const EXTENSIONS: Record<AssetKind, ReadonlySet<string>> = {
  image: new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]),
  video: new Set([".mp4", ".webm", ".mov", ".m4v"]),
  audio: new Set([".mp3", ".m4a", ".wav", ".ogg", ".flac", ".webm"]),
};
export function mediaKind(name: string): AssetKind | undefined {
  const extension = extname(name).toLowerCase();
  return (Object.keys(EXTENSIONS) as AssetKind[]).find((kind) =>
    EXTENSIONS[kind].has(extension),
  );
}
export interface StoredAsset {
  asset: Asset;
  file: string;
  bytes: number;
}

async function removeIfPresent(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

/** Same-directory rename publishes a complete document at one commit point. */
export async function atomicJson(path: string, value: unknown): Promise<void> {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    const file = await open(temporary, "wx", 0o600);
    try {
      await file.writeFile(JSON.stringify(value));
      await file.sync();
    } finally {
      await file.close();
    }
    await rename(temporary, path);
  } finally {
    await removeIfPresent(temporary);
  }
}

/** Owns trusted asset locations and serializes project commits in request order. */
export class StudioStore {
  readonly root: string;
  private writes: Promise<void> = Promise.resolve();
  constructor(dataDir: string) {
    this.root = resolve(dataDir);
  }
  async init(): Promise<void> {
    await Promise.all(
      ["projects", "assets", "exports"].map((dir) =>
        mkdir(join(this.root, dir), { recursive: true, mode: 0o700 }),
      ),
    );
    await Promise.all(
      ["projects", "assets", "exports"].map((dir) => this.directory(dir)),
    );
  }
  private async directory(name: string): Promise<string> {
    const directory = join(this.root, name);
    const info = await lstat(directory);
    if (info.isSymbolicLink() || !info.isDirectory())
      throw new HttpError(403, "工作台存储目录不可使用符号链接");
    return directory;
  }
  exportPath(id: string): string {
    return join(this.root, "exports", `${assertId(id)}.mp4`);
  }
  async asset(id: string): Promise<StoredAsset> {
    await this.directory("assets");
    const raw: unknown = JSON.parse(
      await readFile(join(this.root, "assets", `${assertId(id)}.json`), "utf8"),
    );
    if (!raw || typeof raw !== "object")
      throw new HttpError(500, "素材记录损坏");
    const record = raw as Record<string, unknown>;
    const asset = assetSchema.parse(record.asset);
    if (
      asset.id !== id ||
      typeof record.extension !== "string" ||
      !EXTENSIONS[asset.kind].has(record.extension) ||
      !Number.isSafeInteger(record.bytes) ||
      Number(record.bytes) <= 0
    )
      throw new HttpError(500, "素材记录损坏");
    const file = join(this.root, "assets", `${id}${record.extension}`);
    const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
      if (!(await handle.stat()).isFile())
        throw new HttpError(404, "素材不存在");
    } finally {
      await handle.close();
    }
    return {
      asset: { ...asset, src: `${PREFIX}/media/${id}` },
      file,
      bytes: Number(record.bytes),
    };
  }
  async canonicalProject(value: unknown): Promise<Project> {
    const project = projectSchema.parse(value);
    const assets = await Promise.all(
      project.assets.map(async (asset) => {
        const stored = await this.asset(asset.id);
        if (asset.src !== stored.asset.src || asset.kind !== stored.asset.kind)
          throw new HttpError(400, "工程只能引用本工作台已导入的素材");
        return {
          ...stored.asset,
          name: asset.name,
          ...(asset.waveform ? { waveform: asset.waveform } : {}),
        };
      }),
    );
    return projectSchema.parse({ ...project, assets });
  }
  async projects(): Promise<Project[]> {
    await this.writes;
    await this.directory("projects");
    const files = (await readdir(join(this.root, "projects"))).filter(
      (file) => file.endsWith(".json") && SAFE_ID.test(file.slice(0, -5)),
    );
    const projects = await Promise.all(
      files.map(async (file) =>
        projectSchema.parse(
          JSON.parse(await readFile(join(this.root, "projects", file), "utf8")),
        ),
      ),
    );
    return projects.sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    );
  }
  async project(id: string): Promise<Project> {
    await this.writes;
    await this.directory("projects");
    return projectSchema.parse(
      JSON.parse(
        await readFile(
          join(this.root, "projects", `${assertId(id)}.json`),
          "utf8",
        ),
      ),
    );
  }
  saveProject(
    id: string,
    value: unknown,
    expectedUpdatedAt?: string | null,
  ): Promise<Project> {
    assertId(id);
    const snapshot = structuredClone(value);
    const write = this.writes.then(async () => {
      await this.directory("projects");
      const project = await this.canonicalProject(snapshot);
      if (project.id !== id) throw new HttpError(400, "工程 ID 与路径不一致");
      let previous: Project | undefined;
      try {
        previous = projectSchema.parse(
          JSON.parse(
            await readFile(join(this.root, "projects", `${id}.json`), "utf8"),
          ),
        );
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      if (
        expectedUpdatedAt !== undefined &&
        expectedUpdatedAt !== (previous?.updatedAt ?? null)
      ) {
        throw new HttpError(
          409,
          "工程已被 DSH Agent 或其他窗口更新。请载入最新版本后继续编辑。",
        );
      }
      const committed = {
        ...project,
        updatedAt: new Date(
          Math.max(
            Date.now(),
            previous ? Date.parse(previous.updatedAt) + 1 : 0,
          ),
        ).toISOString(),
      };
      await atomicJson(join(this.root, "projects", `${id}.json`), committed);
      return committed;
    });
    this.writes = write.then(
      () => undefined,
      () => undefined,
    );
    return write;
  }
  async upload(
    req: IncomingMessage | (Readable & { headers: IncomingMessage["headers"] }),
    query: URLSearchParams,
    signal: AbortSignal,
    maxBytes = MAX_UPLOAD_BYTES,
  ): Promise<Asset> {
    await this.directory("assets");
    const name = query.get("name") ?? "";
    const kind = query.get("kind") as AssetKind;
    const extension = extname(name).toLowerCase();
    if (
      name.length === 0 ||
      name.length > 240 ||
      !EXTENSIONS[kind]?.has(extension)
    )
      throw new HttpError(415, "请选择支持的视频、音频或图片格式");
    const asset = assetSchema.parse({
      id: randomUUID(),
      name,
      kind,
      src: "",
      duration: Number(query.get("duration")),
      ...(query.has("width") ? { width: Number(query.get("width")) } : {}),
      ...(query.has("height") ? { height: Number(query.get("height")) } : {}),
    });
    asset.src = `${PREFIX}/media/${asset.id}`;
    const declared = req.headers["content-length"];
    if (declared && Number(declared) > maxBytes)
      throw new HttpError(413, "素材超过上传大小限制");
    const target = join(this.root, "assets", `${asset.id}${extension}`);
    const temporary = `${target}.upload`;
    const file = await open(temporary, "wx", 0o600);
    const abort = (): void => {
      // The AbortSignal owns the failure; an extra stream error can outlive its iterator.
      req.destroy();
    };
    signal.addEventListener("abort", abort, { once: true });
    let size = 0;
    let published = false;
    try {
      signal.throwIfAborted();
      for await (const chunk of req.iterator({ destroyOnReturn: false })) {
        signal.throwIfAborted();
        const bytes = Buffer.from(chunk as Uint8Array);
        size += bytes.length;
        if (size > maxBytes) {
          req.resume();
          throw new HttpError(413, "素材超过上传大小限制");
        }
        await file.writeFile(bytes);
      }
      signal.throwIfAborted();
      if (size === 0) throw new HttpError(400, "素材文件为空");
      await file.sync();
      await file.close();
      signal.throwIfAborted();
      await rename(temporary, target);
      await atomicJson(join(this.root, "assets", `${asset.id}.json`), {
        asset,
        extension,
        bytes: size,
      });
      signal.throwIfAborted();
      published = true;
      return asset;
    } finally {
      signal.removeEventListener("abort", abort);
      await file.close();
      await removeIfPresent(temporary);
      if (!published) {
        await removeIfPresent(target);
        await removeIfPresent(join(this.root, "assets", `${asset.id}.json`));
      }
    }
  }
  async importFile(
    path: string,
    query: URLSearchParams,
    signal: AbortSignal,
    maxBytes = MAX_UPLOAD_BYTES,
  ): Promise<Asset> {
    const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    let source: Readable | undefined;
    try {
      const info = await file.stat();
      if (!info.isFile() || info.size === 0)
        throw new HttpError(400, "素材文件为空或不可读取");
      if (info.size > maxBytes)
        throw new HttpError(413, "素材超过上传大小限制");
      source = file.createReadStream({ autoClose: false });
      return await this.upload(
        Object.assign(source, {
          headers: { "content-length": String(info.size) },
        }),
        query,
        signal,
        maxBytes,
      );
    } finally {
      source?.destroy();
      await file.close();
    }
  }
  async dispose(): Promise<void> {
    await this.writes;
  }
}
