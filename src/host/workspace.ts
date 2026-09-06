import { constants } from "node:fs";
import { lstat, open, opendir, realpath } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, sep } from "node:path";
import type { Project } from "../types";
import type { WorkspaceEntry, WorkspaceListing } from "../core/workspace";
import { assertId, HttpError } from "./http";
import { mediaKind } from "./storage";

export type WorkspaceResolver = (
  sessionId: string,
  signal: AbortSignal,
) => Promise<string | undefined>;

interface SessionHeaders {
  get(id: string): { header: { cwd?: string } } | undefined;
}
interface PersistedHeaders {
  list(signal?: AbortSignal): Promise<readonly { id: string; cwd?: string }[]>;
}
interface RegisteredWorkspaces {
  list(): readonly { path: string; sessionIds: readonly string[] }[];
}

/** rc.1's metadata API does not read messages or activate an Agent. */
export async function sessionWorkspace(
  sessionId: string,
  signal: AbortSignal,
  sessions: SessionHeaders,
  persistence: PersistedHeaders,
  workspaces?: RegisteredWorkspaces,
): Promise<string | undefined> {
  assertId(sessionId);
  signal.throwIfAborted();
  const workspace = workspaces
    ?.list()
    .find((item) => item.sessionIds.includes(sessionId));
  if (workspace) return workspace.path;
  const live = sessions.get(sessionId);
  if (live) return live.header.cwd;
  const headers = await persistence.list(signal);
  signal.throwIfAborted();
  return headers.find((header) => header.id === sessionId)?.cwd;
}

const HIDDEN_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  "target",
  "vendor",
]);
const MAX_SCANNED = 1200;
const MAX_ENTRIES = 200;
const skipped = (name: string) =>
  name.startsWith(".") || HIDDEN_DIRECTORIES.has(name);

/** Each request reads one directory, bounded independently of workspace size. */
export class WorkspaceFiles {
  constructor(private readonly resolver?: WorkspaceResolver) {}

  async root(sessionId: string, signal: AbortSignal): Promise<string> {
    assertId(sessionId);
    signal.throwIfAborted();
    if (!this.resolver)
      throw new HttpError(503, "请从 DSH 会话中浏览工作区素材");
    const cwd = await this.resolver(sessionId, signal);
    signal.throwIfAborted();
    if (!cwd) throw new HttpError(404, "会话不存在或尚未选择工作区");
    const root = await realpath(cwd);
    if (!(await lstat(root)).isDirectory())
      throw new HttpError(404, "工作区目录不存在");
    return root;
  }

  private async resolvePath(
    root: string,
    path: string,
    signal: AbortSignal,
  ): Promise<string> {
    if (path.length > 4096 || isAbsolute(path) || /[\\\0]/.test(path))
      throw new HttpError(400, "需要工作区内的相对路径");
    const parts = path ? path.split("/") : [];
    if (
      parts.some(
        (part) => !part || part === "." || part === ".." || skipped(part),
      )
    )
      throw new HttpError(403, "此路径不在工作区素材浏览范围内");
    let target = root;
    for (const part of parts) {
      signal.throwIfAborted();
      target = join(target, part);
      if ((await lstat(target)).isSymbolicLink())
        throw new HttpError(403, "素材浏览不跟随符号链接");
    }
    const canonical = await realpath(target);
    if (canonical !== root && !canonical.startsWith(root + sep))
      throw new HttpError(403, "路径超出工作区");
    signal.throwIfAborted();
    return canonical;
  }

  async media(sessionId: string, path: string, signal: AbortSignal) {
    const root = await this.root(sessionId, signal);
    const file = await this.resolvePath(root, path, signal);
    const kind = mediaKind(file);
    if (!kind) throw new HttpError(415, "此文件不是支持的媒体格式");
    const info = await lstat(file);
    if (!info.isFile()) throw new HttpError(404, "素材文件不存在");
    return { file, kind, name: basename(file), size: info.size };
  }

  async list(
    sessionId: string,
    path: string,
    signal: AbortSignal,
  ): Promise<WorkspaceListing> {
    const root = await this.root(sessionId, signal);
    const folder = await this.resolvePath(root, path, signal);
    if (!(await lstat(folder)).isDirectory())
      throw new HttpError(400, "请选择工作区目录");
    const entries: WorkspaceEntry[] = [];
    let scanned = 0;
    let truncated = false;
    const directory = await opendir(folder);
    for await (const entry of directory) {
      signal.throwIfAborted();
      if (++scanned > MAX_SCANNED || entries.length >= MAX_ENTRIES) {
        truncated = true;
        break;
      }
      if (skipped(entry.name) || entry.isSymbolicLink()) continue;
      const kind = entry.isDirectory()
        ? "directory"
        : entry.isFile()
          ? mediaKind(entry.name)
          : undefined;
      if (!kind) continue;
      const item: WorkspaceEntry = {
        name: entry.name,
        path: path ? `${path}/${entry.name}` : entry.name,
        kind,
      };
      if (kind !== "directory") {
        try {
          const info = await lstat(join(folder, entry.name));
          if (!info.isFile()) continue;
          item.size = info.size;
          item.modifiedAt = info.mtime.toISOString();
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
          throw error;
        }
      }
      entries.push(item);
    }
    signal.throwIfAborted();
    entries.sort(
      (a, b) =>
        Number(b.kind === "directory") - Number(a.kind === "directory") ||
        a.name.localeCompare(b.name),
    );
    const remotion = await this.remotion(folder, signal);
    return {
      sessionId,
      workspacePath: root,
      workspaceName: basename(root),
      path,
      parentPath: path ? (dirname(path) === "." ? "" : dirname(path)) : null,
      entries,
      truncated,
      ...(remotion ? { remotion } : {}),
    };
  }

  private async remotion(
    folder: string,
    signal: AbortSignal,
  ): Promise<WorkspaceListing["remotion"]> {
    let handle;
    try {
      handle = await open(
        join(folder, "package.json"),
        constants.O_RDONLY | constants.O_NOFOLLOW,
      );
      const info = await handle.stat();
      if (!info.isFile() || info.size > 128 * 1024) return undefined;
      signal.throwIfAborted();
      const buffer = Buffer.alloc(128 * 1024 + 1);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      signal.throwIfAborted();
      if (bytesRead > 128 * 1024) return undefined;
      const manifest = JSON.parse(
        buffer.toString("utf8", 0, bytesRead),
      ) as Record<string, unknown> | null;
      if (!manifest || typeof manifest !== "object" || Array.isArray(manifest))
        return undefined;
      const dependencies = [manifest.dependencies, manifest.devDependencies];
      const detected = dependencies.some(
        (value) =>
          value &&
          typeof value === "object" &&
          Object.keys(value).some(
            (name) => name === "remotion" || name.startsWith("@remotion/"),
          ),
      );
      if (!detected) return undefined;
      return typeof manifest.name === "string"
        ? { packageName: manifest.name.slice(0, 240) }
        : {};
    } catch (error) {
      if (
        error instanceof SyntaxError ||
        ["ENOENT", "ELOOP"].includes(
          (error as NodeJS.ErrnoException).code ?? "",
        )
      )
        return undefined;
      throw error;
    } finally {
      await handle?.close();
    }
  }

  async filterProjects(
    projects: Project[],
    sessionId: string,
    scope: "session" | "workspace",
    signal: AbortSignal,
  ): Promise<Project[]> {
    const root = await this.root(sessionId, signal);
    const matches: Project[] = [];
    for (const project of projects) {
      signal.throwIfAborted();
      if (
        !project.dsh ||
        (scope === "session" && project.dsh.sessionId !== sessionId)
      )
        continue;
      try {
        if ((await realpath(project.dsh.workspacePath)) === root)
          matches.push(project);
      } catch (error) {
        if (
          !["ENOENT", "ENOTDIR"].includes(
            (error as NodeJS.ErrnoException).code ?? "",
          )
        )
          throw error;
      }
    }
    return matches;
  }
}
