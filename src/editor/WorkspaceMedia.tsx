import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AudioLines,
  ChevronRight,
  Film,
  FolderOpen,
  Image,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  workspaceMediaUrl,
  type WorkspaceEntry,
  type WorkspaceListing,
} from "../core/workspace";
import type { Asset } from "../types";
import { readMediaMetadata, request } from "./api";
import "./workspace.css";

const sizeLabel = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function WorkspaceMedia({
  sessionId,
  maxBytes,
  onImport,
}: {
  sessionId: string;
  maxBytes: number;
  onImport(asset: Asset): void;
}) {
  const [path, setPath] = useState("");
  const [search, setSearch] = useState("");
  const listing = useQuery({
    queryKey: ["studio-workspace", sessionId, path],
    queryFn: ({ signal }) =>
      request<WorkspaceListing>(
        `workspace?${new URLSearchParams({ sessionId, path })}`,
        { signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]) },
      ),
    retry: false,
    networkMode: "always",
  });
  const imported = useMutation({
    mutationFn: async (entry: WorkspaceEntry) => {
      if (entry.kind === "directory") throw new Error("请选择媒体文件");
      if ((entry.size ?? 0) > maxBytes)
        throw new Error(`素材超过 ${sizeLabel(maxBytes)} 导入上限`);
      const metadata = await readMediaMetadata(
        workspaceMediaUrl(sessionId, entry.path),
        entry.kind,
        entry.name,
      );
      const asset = await request<Asset>("workspace/import", {
        method: "POST",
        body: JSON.stringify({ sessionId, path: entry.path, ...metadata }),
      });
      onImport(asset);
      return asset;
    },
  });
  const navigate = (next: string) => {
    setPath(next);
    setSearch("");
    imported.reset();
  };
  const entries = listing.data?.entries.filter((entry) =>
    entry.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div className="workspace-media">
      <p className="modal-description">
        浏览当前会话所在工作区，选择素材加入本会话工程。原文件保持不变。
      </p>
      <div className="workspace-location">
        <button
          className="icon-button"
          aria-label="返回上级目录"
          onClick={() => navigate(listing.data?.parentPath ?? "")}
          disabled={!path || listing.isFetching || imported.isPending}
        >
          <ArrowLeft />
        </button>
        <button
          className="workspace-root"
          onClick={() => navigate("")}
          disabled={imported.isPending}
          title={listing.data?.workspacePath}
        >
          <FolderOpen />
          {listing.data?.workspaceName || "当前工作区"}
        </button>
        <button
          className="icon-button"
          aria-label="刷新工作区素材"
          disabled={listing.isFetching || imported.isPending}
          onClick={() => void listing.refetch()}
        >
          <RefreshCw className={listing.isFetching ? "spin" : ""} />
        </button>
      </div>
      <div className="workspace-relative-path" title={path || "/"}>
        {path || "/"}
      </div>
      <label className="workspace-search">
        <Search />
        <input
          aria-label="筛选当前目录素材"
          placeholder="按文件名筛选当前目录"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      {listing.data?.remotion && (
        <p className="workspace-hint">
          已识别 Remotion 工程，可进入 public 等素材目录选择媒体。 源码中的
          composition 需要由 DSH Agent 转换为本工作台工程。
        </p>
      )}
      {listing.isError ? (
        <p className="workspace-feedback" role="alert">
          {listing.error.message}
          <button
            className="text-button"
            onClick={() => void listing.refetch()}
          >
            重试
          </button>
        </p>
      ) : listing.isPending ? (
        <p className="workspace-feedback" role="status">
          <LoaderCircle className="spin" /> 正在读取工作区…
        </p>
      ) : (
        <div className="workspace-file-list" aria-label="工作区文件">
          {entries?.length ? (
            entries.map((entry) => {
              const Icon =
                entry.kind === "directory"
                  ? FolderOpen
                  : entry.kind === "video"
                    ? Film
                    : entry.kind === "audio"
                      ? AudioLines
                      : Image;
              const oversized = (entry.size ?? 0) > maxBytes;
              const pending =
                imported.isPending && imported.variables.path === entry.path;
              return (
                <button
                  key={entry.path}
                  className="workspace-file"
                  disabled={imported.isPending || oversized}
                  title={
                    oversized
                      ? `超过 ${sizeLabel(maxBytes)} 导入上限`
                      : entry.path
                  }
                  onClick={() =>
                    entry.kind === "directory"
                      ? navigate(entry.path)
                      : imported.mutate(entry)
                  }
                >
                  <Icon className="workspace-file-icon" />
                  <span>
                    <strong>{entry.name}</strong>
                    <small>
                      {entry.kind === "directory"
                        ? "文件夹"
                        : `${sizeLabel(entry.size ?? 0)}${oversized ? " · 超过导入上限" : " · 加入本会话"}`}
                    </small>
                  </span>
                  {pending ? (
                    <LoaderCircle className="spin" />
                  ) : entry.kind === "directory" ? (
                    <ChevronRight />
                  ) : (
                    <Plus />
                  )}
                </button>
              );
            })
          ) : (
            <p className="workspace-feedback">
              {search ? "没有匹配的文件" : "此目录没有可导入的媒体或子目录"}
            </p>
          )}
        </div>
      )}
      {listing.data?.truncated && (
        <p className="workspace-hint">
          目录条目较多，当前显示前一批；请进入具体素材目录。
        </p>
      )}
      <div aria-live="polite" className="workspace-import-status">
        {imported.isPending && <span>正在导入 {imported.variables.name}…</span>}
        {imported.isError && <span role="alert">{imported.error.message}</span>}
        {imported.isSuccess && <span>已加入素材库：{imported.data.name}</span>}
      </div>
    </div>
  );
}
