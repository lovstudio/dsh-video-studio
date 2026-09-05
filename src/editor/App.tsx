import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  AudioLines,
  Captions,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clapperboard,
  Clock3,
  Download,
  FileJson,
  FilePlus2,
  Film,
  FolderOpen,
  Image,
  Keyboard,
  LoaderCircle,
  Maximize2,
  Mic,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  MoveUpRight,
  Type,
  Undo2,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import { StudioComposition } from "../remotion/StudioComposition";
import {
  addAssetClip,
  captionsToClips,
  createClip,
  createProject,
  durationInFrames,
  formatTime,
  projectSchema,
  splitClip,
  uid,
  updateClip,
} from "../core/project";
import { exportSrt, parseSrt } from "../core/captions";
import type {
  Asset,
  Clip,
  Project,
  StudioCapabilities,
  StudioJob,
} from "../types";
import { API, download, request, uploadMedia } from "./api";
import { useEditor } from "./useEditor";
import { Inspector } from "./Inspector";
import { Timeline } from "./Timeline";
import { IconButton } from "./ui";

type Panel = "assets" | "titles" | "captions" | "motion";
const terminal = (status?: string) =>
  ["completed", "failed", "cancelled"].includes(status || "");
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button,input,select")?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Tab") {
            const items = ref.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled),a[href],input,select,textarea",
            );
            if (!items?.length) return;
            const first = items[0],
              last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <header>
          <h2>{title}</h2>
          <IconButton label="关闭窗口" onClick={onClose}>
            <X />
          </IconButton>
        </header>
        {children}
      </div>
    </div>
  );
}
export function App() {
  const { project, edit, undo, redo, history, save, retry, load, current } =
    useEditor();
  const [selectedId, setSelectedId] = useState<string | null>(
      project.clips[0]?.id || null,
    ),
    [panel, setPanel] = useState<Panel>("assets");
  const [frame, setFrame] = useState(
      project.name === "灵感成片 · 开场练习" && project.clips.length === 3
        ? 45
        : 0,
    ),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [asrAsset, setAsrAsset] = useState(""),
    [language, setLanguage] = useState("zh"),
    [dropActive, setDropActive] = useState(false);
  const [renderId, setRenderId] = useState<string>(),
    [asrId, setAsrId] = useState<string>();
  const asrOrigin = useRef<{
      projectId: string;
      assetId: string;
      fps: number;
      clips: Clip[];
    } | null>(null),
    handledAsr = useRef(new Set<string>());
  const player = useRef<PlayerRef>(null),
    app = useRef<HTMLDivElement>(null),
    fileInput = useRef<HTMLInputElement>(null),
    srtInput = useRef<HTMLInputElement>(null),
    jsonInput = useRef<HTMLInputElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const capabilities = useQuery({
    queryKey: ["studio-capabilities"],
    queryFn: ({ signal }) =>
      request<StudioCapabilities>("capabilities", { signal }),
  });
  const projects = useQuery({
    queryKey: ["studio-projects"],
    queryFn: ({ signal }) => request<Project[]>("projects", { signal }),
    enabled: projectsOpen,
  });
  const renderJob = useQuery({
    queryKey: ["studio-job", renderId],
    queryFn: ({ signal }) => request<StudioJob>(`jobs/${renderId}`, { signal }),
    enabled: !!renderId,
    refetchInterval: (query) =>
      terminal(query.state.data?.status) ? false : 900,
  });
  const asrJob = useQuery({
    queryKey: ["studio-job", asrId],
    queryFn: ({ signal }) => request<StudioJob>(`jobs/${asrId}`, { signal }),
    enabled: !!asrId,
    refetchInterval: (query) =>
      terminal(query.state.data?.status) ? false : 1100,
  });
  const duration = durationInFrames(project),
    selected = project.clips.find((c) => c.id === selectedId);
  const inputProps = useMemo(() => ({ project }), [project]);
  const reportError = (value: unknown) =>
    setError(value instanceof Error ? value.message : String(value));
  const seek = useCallback(
    (value: number) => {
      const at = Math.min(
        durationInFrames(current.current) - 1,
        Math.max(0, Math.round(value)),
      );
      player.current?.seekTo(at);
      setFrame(at);
    },
    [current],
  );
  const select = useCallback((id: string) => setSelectedId(id), []);
  const togglePlay = useCallback(() => {
    if (player.current?.isPlaying()) player.current.pause();
    else player.current?.play();
  }, []);
  useEffect(() => {
    const ref = player.current;
    if (!ref) return;
    const update = (event: { detail: { frame: number } }) =>
        setFrame(event.detail.frame),
      play = () => setPlaying(true),
      pause = () => setPlaying(false);
    if (frame > 0) ref.seekTo(frame);
    ref.addEventListener("frameupdate", update);
    ref.addEventListener("play", play);
    ref.addEventListener("pause", pause);
    ref.addEventListener("ended", pause);
    return () => {
      ref.removeEventListener("frameupdate", update);
      ref.removeEventListener("play", play);
      ref.removeEventListener("pause", pause);
      ref.removeEventListener("ended", pause);
    };
  }, []);
  useEffect(() => {
    const hostMessage = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === window.parent &&
        event.data?.channel === "dsh-video-studio" &&
        event.data?.type === "pause"
      )
        player.current?.pause();
    };
    window.addEventListener("message", hostMessage);
    return () => window.removeEventListener("message", hostMessage);
  }, []);
  useEffect(() => {
    if (frame >= duration) seek(duration - 1);
  }, [duration, frame, seek]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".entrance", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });
    }, app);
    return () => ctx.revert();
  }, []);
  const patch = useCallback(
    (change: Partial<Clip>) => {
      if (selectedId) edit((p) => updateClip(p, selectedId, change));
    },
    [selectedId, edit],
  );
  const remove = useCallback(() => {
    if (selectedId)
      edit((p) => ({
        ...p,
        clips: p.clips.filter((c) => c.id !== selectedId),
      }));
    setSelectedId(null);
  }, [selectedId, edit]);
  const duplicate = useCallback(() => {
    const source = current.current.clips.find((c) => c.id === selectedId);
    if (!source) return;
    if (
      current.current.clips.length >= 3000 ||
      source.start + source.duration * 2 > current.current.fps * 1800
    ) {
      setError("复制后的片段将超过 30 分钟工程上限");
      return;
    }
    const copy = {
      ...source,
      id: uid(),
      name: `${source.name} · 副本`.slice(0, 240),
      start: source.start + source.duration,
    };
    edit((p) => ({ ...p, clips: [...p.clips, copy] }));
    setSelectedId(copy.id);
  }, [selectedId, current, edit]);
  const split = useCallback(() => {
    if (selectedId)
      edit((p) => {
        if (p.clips.length >= 3000) {
          setError("工程最多支持 3000 个片段");
          return p;
        }
        return splitClip(
          p,
          selectedId,
          player.current?.getCurrentFrame() ?? frame,
        );
      });
  }, [selectedId, frame, edit]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement)?.closest(
          'input,textarea,select,[contenteditable="true"],[role="dialog"]',
        ) ||
        projectsOpen ||
        shortcutsOpen
      )
        return;
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.code === "KeyZ") {
        event.preventDefault();
        event.shiftKey ? redo() : undo();
      } else if (mod && event.code === "KeyY") {
        event.preventDefault();
        redo();
      } else if (mod && event.code === "KeyS") {
        event.preventDefault();
        retry();
      } else if (
        event.code === "Space" &&
        !(event.target as HTMLElement)?.closest("button,a")
      ) {
        event.preventDefault();
        togglePlay();
      } else if (!mod && event.code === "KeyS") {
        event.preventDefault();
        split();
      } else if (["Delete", "Backspace"].includes(event.key)) {
        event.preventDefault();
        remove();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        seek(
          (player.current?.getCurrentFrame() ?? frame) +
            (event.key === "ArrowRight" ? 1 : -1) *
              (event.shiftKey ? project.fps : 1),
        );
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [
    undo,
    redo,
    retry,
    togglePlay,
    split,
    remove,
    seek,
    frame,
    project.fps,
    projectsOpen,
    shortcutsOpen,
  ]);
  const uploads = useMutation({
    mutationFn: async (files: File[]) => {
      const origin = current.current.id;
      if (current.current.assets.length + files.length > 500)
        throw new Error("每个工程最多支持 500 个素材");
      for (const file of files) {
        const asset = await uploadMedia(
          file,
          capabilities.data?.maxUploadBytes || 500 * 1024 * 1024,
        );
        if (current.current.id !== origin)
          throw new Error("工程已切换，已上传的素材未加入当前工程");
        edit((p) => ({ ...p, assets: [...p.assets, asset] }));
      }
    },
    onError: reportError,
  });
  const addMedia = (asset: Asset) => {
    edit((p) => {
      if (p.clips.length >= 3000) {
        setError("工程最多支持 3000 个片段");
        return p;
      }
      const next = addAssetClip(p, asset);
      const last = next.clips[next.clips.length - 1];
      if (last.start + last.duration > p.fps * 1800) {
        setError("加入此素材会超过 30 分钟工程上限，请使用更短的素材");
        return p;
      }
      setSelectedId(last.id);
      return next;
    });
  };
  const addTitle = (preset?: Partial<Clip>) => {
    const clip = createClip({
      start: frame,
      duration: project.fps * 5,
      ...preset,
    });
    if (
      project.clips.length >= 3000 ||
      clip.start + clip.duration > project.fps * 1800
    ) {
      setError("无法添加：工程最多支持 3000 个片段，总长不超过 30 分钟");
      return;
    }
    edit((p) => ({ ...p, clips: [...p.clips, clip] }));
    setSelectedId(clip.id);
  };
  const render = useMutation({
    mutationFn: () =>
      request<StudioJob>("render", {
        method: "POST",
        body: JSON.stringify({ project: current.current }),
      }),
    onSuccess: (job) => {
      setRenderId(job.id);
      queryClient.setQueryData(["studio-job", job.id], job);
    },
    onError: reportError,
  });
  const transcribe = useMutation({
    mutationFn: async () => {
      const source = current.current.assets.find((a) => a.id === asrAsset);
      if (!source) throw new Error("请先选择一段视频或音频");
      asrOrigin.current = {
        projectId: current.current.id,
        assetId: source.id,
        fps: current.current.fps,
        clips:
          selected?.assetId === source.id
            ? [selected]
            : current.current.clips.filter((c) => c.assetId === source.id),
      };
      return request<StudioJob>("asr", {
        method: "POST",
        body: JSON.stringify({
          assetId: source.id,
          language: language || undefined,
        }),
      });
    },
    onSuccess: (job) => {
      setAsrId(job.id);
      queryClient.setQueryData(["studio-job", job.id], job);
    },
    onError: reportError,
  });
  const cancel = useMutation({
    mutationFn: (id: string) =>
      request<StudioJob>(`jobs/${id}/cancel`, { method: "POST" }),
    onSuccess: (job) => queryClient.setQueryData(["studio-job", job.id], job),
    onError: reportError,
  });
  useEffect(() => {
    const job = asrJob.data,
      origin = asrOrigin.current;
    if (
      job?.status !== "completed" ||
      !job.segments ||
      !origin ||
      handledAsr.current.has(job.id)
    )
      return;
    handledAsr.current.add(job.id);
    if (current.current.id !== origin.projectId) {
      setError(
        "字幕转录已完成，因工程已切换未自动插入。请从转录结果下载 SRT。",
      );
      return;
    }
    const segments = origin.clips.length
      ? origin.clips.flatMap((clip) =>
          job.segments!.flatMap((segment) => {
            const start = Math.max(
                segment.start,
                clip.sourceStart / origin.fps,
              ),
              end = Math.min(
                segment.end,
                (clip.sourceStart + clip.duration) / origin.fps,
              );
            const offset = (clip.start - clip.sourceStart) / origin.fps;
            return end > start
              ? [
                  {
                    text: segment.text,
                    start: start + offset,
                    end: end + offset,
                  },
                ]
              : [];
          }),
        )
      : job.segments;
    const clips = captionsToClips(segments, origin.fps);
    if (
      current.current.clips.length + clips.length > 3000 ||
      clips.some((c) => c.start + c.duration > origin.fps * 1800)
    ) {
      setError(
        "转录完成，但字幕超过 3000 片段或 30 分钟限制，未自动插入。请下载 SRT 结果。",
      );
      return;
    }
    edit((p) => ({ ...p, clips: [...p.clips, ...clips] }));
    if (clips[0]) setSelectedId(clips[0].id);
  }, [asrJob.data, edit, current]);
  const importSrt = async (file: File) => {
    try {
      const segments = parseSrt(await file.text()),
        clips = captionsToClips(segments, current.current.fps);
      if (
        current.current.clips.length + clips.length > 3000 ||
        clips.some((c) => c.start + c.duration > current.current.fps * 1800)
      )
        throw new Error("字幕超出 3000 片段或 30 分钟工程上限");
      edit((p) => ({ ...p, clips: [...p.clips, ...clips] }));
      setPanel("captions");
      setSelectedId(clips[0]?.id || null);
    } catch (e) {
      reportError(e);
    }
  };
  const importJson = async (file: File) => {
    try {
      const next = projectSchema.parse(JSON.parse(await file.text()));
      loadProject(next);
    } catch (e) {
      reportError(e);
    }
  };
  const loadProject = (next: Project) => {
    player.current?.pause();
    load(next);
    setSelectedId(next.clips[0]?.id || null);
    seek(0);
    setProjectsOpen(false);
    setMenuOpen(false);
  };
  const captions = project.clips
      .filter((c) => c.kind === "caption")
      .sort((a, b) => a.start - b.start),
    speechAssets = project.assets.filter((a) => a.kind !== "image");
  const saveLabel =
    save.status === "saved"
      ? "已保存到本机"
      : save.status === "saving"
        ? "正在保存"
        : save.status === "error"
          ? "保存失败"
          : "等待保存";
  const renderBusy =
    render.isPending || (!!renderId && !terminal(renderJob.data?.status));
  return (
    <div className="studio-app" ref={app}>
      <header className="app-header entrance">
        <div className="brand">
          <div className="brand-symbol">
            <Clapperboard />
          </div>
          <div>
            <strong>
              Video Studio<span>DSH WORKSPACE</span>
            </strong>
          </div>
        </div>
        <div className="project-identity">
          <input
            aria-label="工程名称"
            value={project.name}
            maxLength={240}
            onChange={(e) => {
              const name = e.target.value;
              edit((p) => ({ ...p, name }));
            }}
            onBlur={() => {
              if (!project.name.trim())
                edit((p) => ({ ...p, name: "未命名作品" }));
            }}
          />
          <div className={`save-state ${save.status}`} title={save.message}>
            {save.status === "saved" ? (
              <CheckCircle2 />
            ) : save.status === "error" ? (
              <CircleAlert />
            ) : (
              <span className="status-dot" />
            )}
            {saveLabel}
            {save.status === "error" && <button onClick={retry}>重试</button>}
            {project.name === "灵感成片 · 开场练习" &&
              !project.assets.length && (
                <span className="demo-label">示例工程</span>
              )}
          </div>
        </div>
        <div className="header-actions">
          <div className="tool-group history-tools">
            <IconButton
              label="撤销 (⌘Z)"
              onClick={undo}
              disabled={!history.undo}
            >
              <Undo2 />
            </IconButton>
            <IconButton
              label="重做 (⇧⌘Z)"
              onClick={redo}
              disabled={!history.redo}
            >
              <Redo2 />
            </IconButton>
            <span className="tool-divider" />
            <IconButton
              label="打开工程"
              onClick={() => {
                void queryClient.invalidateQueries({
                  queryKey: ["studio-projects"],
                });
                setProjectsOpen(true);
              }}
            >
              <FolderOpen />
            </IconButton>
            <div className="menu-anchor">
              <IconButton
                label="工程操作"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreHorizontal />
              </IconButton>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => loadProject(createProject(false))}>
                    <FilePlus2 />
                    新建空白工程
                  </button>
                  <button
                    onClick={() => {
                      download(
                        JSON.stringify(project, null, 2),
                        `${project.name}.json`,
                      );
                      setMenuOpen(false);
                    }}
                  >
                    <FileJson />
                    导出工程备份
                  </button>
                  <button
                    onClick={() => {
                      jsonInput.current?.click();
                      setMenuOpen(false);
                    }}
                  >
                    <ArrowUpFromLine />
                    恢复工程备份
                  </button>
                  <button
                    onClick={() => {
                      setShortcutsOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    <Keyboard />
                    键盘快捷键
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            className="primary-button export-button"
            disabled={
              renderBusy ||
              !capabilities.data?.render.available ||
              !project.clips.length
            }
            title={
              !capabilities.data?.render.available
                ? "渲染服务尚不可用"
                : "使用 Remotion 渲染 H.264 MP4"
            }
            onClick={() => render.mutate()}
          >
            {renderBusy ? (
              <LoaderCircle className="spin" />
            ) : (
              <ArrowUpFromLine />
            )}
            <span>{renderBusy ? "正在导出" : "导出影片"}</span>
          </button>
        </div>
      </header>
      {(error || capabilities.isError || save.status === "error") && (
        <div className="error-banner" role="alert">
          <CircleAlert />
          <span>
            {error ||
              (capabilities.isError
                ? "无法连接视频工作台服务。请确认 DSH 插件或开发服务正在运行。"
                : save.message)}
          </span>
          <IconButton
            label="关闭提示"
            onClick={() => {
              setError("");
              if (save.status === "error") retry();
              if (capabilities.isError) void capabilities.refetch();
            }}
          >
            <X />
          </IconButton>
        </div>
      )}
      <main className="editor-workspace entrance">
        <nav className="nav-rail" aria-label="创作工具">
          {(
            [
              { id: "assets", label: "素材", Icon: FolderOpen },
              { id: "titles", label: "标题", Icon: Type },
              { id: "captions", label: "字幕", Icon: Captions },
              { id: "motion", label: "动效", Icon: MoveUpRight },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={panel === item.id ? "active" : ""}
              aria-label={item.label}
              aria-pressed={panel === item.id}
              title={item.label}
              onClick={() => setPanel(item.id)}
            >
              <item.Icon />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="rail-spacer" />
          <button
            aria-label="查看快捷键"
            title="查看快捷键"
            onClick={() => setShortcutsOpen(true)}
          >
            <Keyboard />
            <span>快捷键</span>
          </button>
        </nav>
        <aside
          className={`library-panel ${dropActive ? "drop-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDropActive(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node))
              setDropActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDropActive(false);
            if (!uploads.isPending)
              uploads.mutate(Array.from(e.dataTransfer.files));
          }}
          aria-label="素材与创作面板"
        >
          <header className="panel-heading">
            <h2>
              {panel === "assets"
                ? "素材库"
                : panel === "titles"
                  ? "标题与文字"
                  : panel === "captions"
                    ? "字幕工作流"
                    : "动效预设"}
            </h2>
            <span className="panel-counter">
              {panel === "assets"
                ? String(project.assets.length).padStart(2, "0")
                : panel === "captions"
                  ? String(captions.length).padStart(2, "0")
                  : "04"}
            </span>
          </header>
          <div className="library-content">
            {panel === "assets" && (
              <>
                <button
                  className={`import-area ${uploads.isPending ? "uploading" : ""}`}
                  onClick={() => fileInput.current?.click()}
                  disabled={uploads.isPending}
                >
                  {uploads.isPending ? (
                    <LoaderCircle className="spin" />
                  ) : (
                    <Plus />
                  )}
                  <strong>
                    {uploads.isPending ? "正在导入素材…" : "导入素材"}
                  </strong>
                  <span>拖入视频、音频或图片</span>
                  <small>MP4 · MOV · MP3 · WAV · PNG · JPG</small>
                </button>
                {project.assets.length ? (
                  <div className="asset-list">
                    {project.assets.map((asset) => (
                      <div className="asset-item" key={asset.id}>
                        <div className={`asset-thumbnail kind-${asset.kind}`}>
                          {asset.kind === "image" ? (
                            <img src={asset.src} alt={asset.name} />
                          ) : asset.kind === "video" ? (
                            <video src={asset.src} preload="metadata" muted />
                          ) : (
                            <AudioLines />
                          )}
                          <span>{asset.kind.toUpperCase()}</span>
                        </div>
                        <div className="asset-description">
                          <strong title={asset.name}>{asset.name}</strong>
                          <span>
                            {asset.kind === "image"
                              ? `${asset.width} × ${asset.height}`
                              : `${Math.floor(asset.duration / 60)}:${String(Math.floor(asset.duration % 60)).padStart(2, "0")}${asset.width ? ` · ${asset.width} × ${asset.height}` : ""}`}
                          </span>
                        </div>
                        <IconButton
                          label={`将 ${asset.name} 加入时间线`}
                          onClick={() => addMedia(asset)}
                        >
                          <Plus />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="library-empty">
                    <div className="empty-composition">
                      <span />
                      <span />
                      <span />
                    </div>
                    <h3>
                      好故事，
                      <br />
                      从一段素材开始。
                    </h3>
                    <p>
                      把素材放在这里。
                      <br />
                      你的下一个作品，正在酝酿。
                    </p>
                  </div>
                )}
                <div className="library-footnote">
                  <span className="tiny-line" />
                  素材保存在本机工作台目录
                </div>
              </>
            )}
            {panel === "titles" && (
              <>
                <p className="panel-description">
                  用简练的文字，为画面定调。
                  <br />
                  点击预设，添加到播放头位置。
                </p>
                <div className="title-presets">
                  {[
                    {
                      name: "主标题",
                      text: "让灵感，成为作品。",
                      tone: "clay",
                      motion: "rise",
                      size: 92,
                      label: "大字开场",
                    },
                    {
                      name: "章节标题",
                      text: "每一帧，都有表达。",
                      tone: "sage",
                      motion: "drift",
                      size: 76,
                      label: "章节转场",
                    },
                    {
                      name: "片尾标题",
                      text: "未完，待续。",
                      tone: "ink",
                      motion: "fade",
                      size: 88,
                      label: "留白片尾",
                    },
                  ].map((preset, i) => (
                    <button
                      key={preset.name}
                      className={`title-preset tone-${preset.tone}`}
                      onClick={() =>
                        addTitle({
                          name: preset.name,
                          text: preset.text,
                          tone: preset.tone as Clip["tone"],
                          motion: preset.motion as Clip["motion"],
                          fontSize: preset.size,
                        })
                      }
                    >
                      <span className="preset-number">0{i + 1}</span>
                      <strong>{preset.text}</strong>
                      <span className="preset-caption">
                        {preset.label}
                        <Plus size={14} />
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  className="secondary-button full-width"
                  onClick={() =>
                    addTitle({
                      name: "自定义文字",
                      text: "输入你的文字",
                      tone: "ink",
                      motion: "none",
                      fontSize: 64,
                    })
                  }
                >
                  <Type />
                  添加自定义文字
                </button>
              </>
            )}
            {panel === "captions" && (
              <>
                <div className="caption-actions">
                  <button
                    className="secondary-button"
                    onClick={() => srtInput.current?.click()}
                  >
                    <Upload />
                    导入 SRT
                  </button>
                  <button
                    className="secondary-button"
                    disabled={!captions.length}
                    onClick={() =>
                      download(
                        exportSrt(project),
                        `${project.name}.srt`,
                        "text/plain;charset=utf-8",
                      )
                    }
                  >
                    <Download />
                    导出 SRT
                  </button>
                </div>
                <section className="asr-section">
                  <div className="section-label">
                    <span>
                      <Mic size={14} />
                      语音转字幕
                    </span>
                    <span
                      className={`availability ${capabilities.data?.asr.configured ? "ready" : ""}`}
                    >
                      {capabilities.isPending
                        ? "检查中"
                        : capabilities.data?.asr.configured
                          ? "已就绪"
                          : "未配置"}
                    </span>
                  </div>
                  {!capabilities.data?.asr.configured ? (
                    <p className="help-text">
                      尚未连接语音识别服务。配置服务端 ASR
                      后可转录，也可直接导入 SRT 字幕。
                    </p>
                  ) : (
                    <>
                      <label className="sr-only" htmlFor="asr-asset">
                        选择待转录素材
                      </label>
                      <select
                        id="asr-asset"
                        value={asrAsset}
                        onChange={(e) => setAsrAsset(e.target.value)}
                      >
                        <option value="">选择音频或视频</option>
                        {speechAssets.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                      <div className="asr-controls">
                        <select
                          aria-label="转录语言"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="">自动识别</option>
                          <option value="zh">中文</option>
                          <option value="en">English</option>
                          <option value="ja">日本語</option>
                        </select>
                        <button
                          className="secondary-button"
                          disabled={
                            !asrAsset ||
                            transcribe.isPending ||
                            (!!asrId && !terminal(asrJob.data?.status))
                          }
                          onClick={() => transcribe.mutate()}
                        >
                          <Mic />
                          开始转录
                        </button>
                      </div>
                      <p className="help-text">
                        {capabilities.data.asr.provider} ·{" "}
                        {capabilities.data.asr.model || "已配置模型"}
                        <br />
                        按所选片段的修剪范围对齐；未选中时应用到素材的全部片段。
                      </p>
                    </>
                  )}
                  {asrJob.data && (
                    <JobCard
                      job={asrJob.data}
                      onCancel={() => cancel.mutate(asrJob.data!.id)}
                      cancelling={cancel.isPending}
                      onDismiss={() => setAsrId(undefined)}
                      onDownload={
                        asrJob.data.segments
                          ? () =>
                              download(
                                exportSrt({
                                  ...project,
                                  clips: captionsToClips(
                                    asrJob.data!.segments!,
                                    project.fps,
                                  ),
                                }),
                                "转录字幕.srt",
                                "text/plain;charset=utf-8",
                              )
                          : undefined
                      }
                    />
                  )}
                </section>
                <div className="section-label caption-list-label">
                  <span>字幕片段</span>
                  <IconButton
                    label="添加字幕"
                    onClick={() =>
                      addTitle({
                        kind: "caption",
                        trackId: "captions",
                        name: "新的字幕",
                        text: "输入字幕内容",
                        fontSize: 48,
                        motion: "none",
                        tone: "ink",
                        duration: project.fps * 3,
                      })
                    }
                  >
                    <Plus />
                  </IconButton>
                </div>
                {captions.length ? (
                  <div className="caption-list">
                    {captions.map((caption, index) => (
                      <button
                        className={selectedId === caption.id ? "selected" : ""}
                        key={caption.id}
                        onClick={() => {
                          setSelectedId(caption.id);
                          seek(caption.start);
                        }}
                      >
                        <span className="caption-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <small>
                            {formatTime(caption.start, project.fps)}
                          </small>
                          <p>{caption.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="caption-empty">
                    <Captions />
                    <p>
                      声音的每一句，
                      <br />
                      都值得被看见。
                    </p>
                  </div>
                )}
              </>
            )}
            {panel === "motion" && (
              <>
                <p className="panel-description">
                  给片段一点呼吸感。
                  <br />
                  先选择片段，再应用动效。
                </p>
                <div className="motion-presets">
                  {(
                    [
                      {
                        id: "none",
                        name: "静止",
                        description: "保持原始画面",
                        symbol: "—",
                      },
                      {
                        id: "fade",
                        name: "柔和淡入",
                        description: "从容进入画面",
                        symbol: "Aa",
                      },
                      {
                        id: "rise",
                        name: "向上浮现",
                        description: "轻盈的上升节奏",
                        symbol: "Aa",
                      },
                      {
                        id: "drift",
                        name: "缓慢推近",
                        description: "不动声色的张力",
                        symbol: "Aa",
                      },
                    ] as const
                  ).map((motion) => (
                    <button
                      key={motion.id}
                      className={`motion-preset motion-${motion.id}`}
                      disabled={
                        !selected ||
                        project.assets.find((a) => a.id === selected.assetId)
                          ?.kind === "audio"
                      }
                      aria-pressed={selected?.motion === motion.id}
                      onClick={() => patch({ motion: motion.id })}
                    >
                      <div className="motion-demo">
                        <span>{motion.symbol}</span>
                      </div>
                      <strong>{motion.name}</strong>
                      <small>{motion.description}</small>
                      {selected?.motion === motion.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
                <p className="help-text motion-note">
                  {selected
                    ? `当前片段：${selected.name}`
                    : "在时间线上选择一个片段"}
                </p>
              </>
            )}
          </div>
        </aside>
        <section className="preview-panel" aria-label="影片预览">
          <header className="preview-heading">
            <span className="eyebrow">PREVIEW</span>
            <span>
              {project.width / project.height > 1
                ? "横屏影片"
                : project.width === project.height
                  ? "方形影片"
                  : "竖屏影片"}
              <i />
              适应画布
            </span>
            <IconButton
              label="全屏预览"
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void stage.current?.requestFullscreen().catch(reportError);
              }}
            >
              <Maximize2 />
            </IconButton>
          </header>
          <div className="preview-stage" ref={stage}>
            <div
              className="preview-player-wrap"
              style={
                {
                  aspectRatio: project.width / project.height,
                  "--composition-ratio": project.width / project.height,
                } as CSSProperties
              }
            >
              <Player
                ref={player}
                component={StudioComposition}
                inputProps={inputProps}
                durationInFrames={duration}
                compositionWidth={project.width}
                compositionHeight={project.height}
                fps={project.fps}
                controls={false}
                clickToPlay={false}
                doubleClickToFullscreen={false}
                spaceKeyToPlayOrPause={false}
                style={{ width: "100%", height: "100%" }}
                errorFallback={({ error: playerError }) => (
                  <div className="player-error">
                    <CircleAlert />
                    <strong>无法预览此片段</strong>
                    <p>{playerError.message}</p>
                  </div>
                )}
              />
            </div>
            {!project.clips.length && (
              <div className="canvas-empty">
                <Film />
                <h2>空白，也是开始。</h2>
                <p>导入素材或添加标题，开启你的作品。</p>
              </div>
            )}
          </div>
          <div className="preview-transport">
            <div className="preview-time">
              <strong>{formatTime(frame, project.fps)}</strong>
              <span>/ {formatTime(duration, project.fps)}</span>
            </div>
            <div className="transport-buttons">
              <IconButton
                label="上一帧 (←)"
                onClick={() => seek(frame - 1)}
                disabled={frame === 0}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                className="play-button"
                label={playing ? "暂停 (Space)" : "播放 (Space)"}
                onClick={togglePlay}
              >
                {playing ? (
                  <Pause fill="currentColor" />
                ) : (
                  <Play fill="currentColor" />
                )}
              </IconButton>
              <IconButton
                label="下一帧 (→)"
                onClick={() => seek(frame + 1)}
                disabled={frame >= duration - 1}
              >
                <ChevronRight />
              </IconButton>
            </div>
            <span className="preview-quality">
              {project.height >= 1080 ? "1080" : project.height}
              <small>P</small>
              <i />
              {project.fps} fps
            </span>
          </div>
          <div className="preview-scrub">
            <input
              aria-label="预览播放进度"
              type="range"
              min="0"
              max={duration - 1}
              step="1"
              value={frame}
              onChange={(e) => seek(Number(e.target.value))}
            />
          </div>
          {renderJob.data && (
            <div className="render-job">
              <JobCard
                job={renderJob.data}
                onCancel={() => cancel.mutate(renderJob.data!.id)}
                cancelling={cancel.isPending}
                onDismiss={() => setRenderId(undefined)}
              />
            </div>
          )}
          {(renderJob.isError || asrJob.isError) && (
            <p className="job-connection-error" role="alert">
              任务状态读取失败，正在重新连接；后台任务可能仍在运行。
            </p>
          )}
        </section>
        <Inspector
          project={project}
          clip={selected}
          patch={patch}
          onDuplicate={duplicate}
          onDelete={remove}
          resize={(width, height) => edit((p) => ({ ...p, width, height }))}
        />
      </main>
      <Timeline
        project={project}
        selectedId={selectedId}
        frame={frame}
        onSelect={select}
        onSeek={seek}
        edit={edit}
        onSplit={split}
        onDuplicate={duplicate}
        onDelete={remove}
      />
      <input
        ref={fileInput}
        type="file"
        className="sr-only"
        aria-label="导入媒体文件"
        accept="video/*,audio/*,image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) uploads.mutate(files);
          e.target.value = "";
        }}
      />
      <input
        ref={srtInput}
        type="file"
        className="sr-only"
        aria-label="导入 SRT 字幕文件"
        accept=".srt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void importSrt(file);
          e.target.value = "";
        }}
      />
      <input
        ref={jsonInput}
        type="file"
        className="sr-only"
        aria-label="恢复 JSON 工程备份"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void importJson(file);
          e.target.value = "";
        }}
      />
      {projectsOpen && (
        <Modal title="你的作品" onClose={() => setProjectsOpen(false)}>
          <p className="modal-description">
            工程与素材保存在当前机器。每一次修改都会自动保存。
          </p>
          <button
            className="secondary-button"
            onClick={() => loadProject(createProject(false))}
          >
            <Plus />
            新建空白工程
          </button>
          <div className="project-list">
            {projects.isPending ? (
              <p>
                <LoaderCircle className="spin" />
                正在读取工程…
              </p>
            ) : projects.isError ? (
              <p role="alert">
                读取失败：{projects.error.message}
                <button
                  className="text-button"
                  onClick={() => void projects.refetch()}
                >
                  重试
                </button>
              </p>
            ) : !projects.data?.length ? (
              <p className="help-text">
                还没有保存的工程。当前作品将在编辑后自动保存。
              </p>
            ) : (
              projects.data?.map((p) => (
                <button key={p.id} onClick={() => loadProject(p)}>
                  <div className="project-mark">
                    <Film />
                  </div>
                  <div>
                    <strong>{p.name}</strong>
                    <span>
                      {p.width} × {p.height} ·{" "}
                      {formatTime(durationInFrames(p), p.fps)} ·{" "}
                      {new Date(p.updatedAt).toLocaleString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {p.id === project.id ? (
                    <span className="current-label">当前</span>
                  ) : (
                    <ChevronRight />
                  )}
                </button>
              ))
            )}
          </div>
          <button
            className="text-button"
            onClick={() => jsonInput.current?.click()}
          >
            <FileJson />从 JSON 备份恢复
          </button>
        </Modal>
      )}
      {shortcutsOpen && (
        <Modal title="保持创作的节奏" onClose={() => setShortcutsOpen(false)}>
          <p className="modal-description">使用快捷键，让注意力留在作品上。</p>
          <dl className="shortcuts">
            {[
              ["播放 / 暂停", "Space"],
              ["前 / 后一帧", "← / →"],
              ["前 / 后一秒", "Shift + ← / →"],
              ["在播放头分割", "S"],
              ["删除所选片段", "Delete"],
              ["撤销", "⌘ / Ctrl + Z"],
              ["重做", "⇧⌘Z / Ctrl + Y"],
              ["立即保存", "⌘ / Ctrl + S"],
            ].map(([label, key]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  <kbd>{key}</kbd>
                </dd>
              </div>
            ))}
          </dl>
          <p className="help-text">
            编辑文字或数值时，快捷键会自动让位给输入。
          </p>
        </Modal>
      )}
    </div>
  );
}
function JobCard({
  job,
  onCancel,
  cancelling,
  onDismiss,
  onDownload,
}: {
  job: StudioJob;
  onCancel: () => void;
  cancelling: boolean;
  onDismiss: () => void;
  onDownload?: () => void;
}) {
  const complete = job.status === "completed",
    failed = job.status === "failed",
    cancelled = job.status === "cancelled";
  const title =
    job.kind === "render"
      ? complete
        ? "影片已准备好"
        : failed
          ? "导出失败"
          : cancelled
            ? "导出已取消"
            : "正在渲染影片"
      : complete
        ? "转录已完成"
        : failed
          ? "转录失败"
          : cancelled
            ? "转录已取消"
            : "正在转录声音";
  return (
    <div className={`job-card ${failed ? "failed" : ""}`} role="status">
      <div className="job-title">
        {complete ? (
          <CheckCircle2 />
        ) : failed ? (
          <CircleAlert />
        ) : cancelled ? (
          <RotateCcw />
        ) : (
          <LoaderCircle className="spin" />
        )}
        <strong>{title}</strong>
        {terminal(job.status) ? (
          <IconButton label="收起任务" onClick={onDismiss}>
            <X />
          </IconButton>
        ) : (
          <button
            className="text-button"
            disabled={cancelling}
            onClick={onCancel}
          >
            {cancelling ? "取消中" : "取消"}
          </button>
        )}
      </div>
      {!terminal(job.status) && (
        <>
          <progress value={job.progress} max="1" aria-label={`${title}进度`} />
          <div className="job-detail">
            <span>
              {job.message ||
                (job.status === "queued" ? "排队等待中" : "处理中")}
            </span>
            <span>{Math.round(job.progress * 100)}%</span>
          </div>
        </>
      )}
      {(failed || cancelled) && (
        <p>{job.message || "任务已停止，可重新发起。"}</p>
      )}
      {complete && (
        <div className="job-complete">
          <span>
            {job.kind === "render"
              ? "H.264 · MP4"
              : `${job.segments?.length || 0} 个字幕片段`}
          </span>
          {job.outputUrl && (
            <a className="secondary-button" href={job.outputUrl} download>
              <Download />
              下载影片
            </a>
          )}
          {onDownload && (
            <button className="secondary-button" onClick={onDownload}>
              <Download />
              下载 SRT
            </button>
          )}
        </div>
      )}
    </div>
  );
}
