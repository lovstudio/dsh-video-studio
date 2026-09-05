import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Copy,
  Magnet,
  Minus,
  Plus,
  Scissors,
  Trash2,
  Type,
  Volume2,
  Image,
  Captions,
} from "lucide-react";
import {
  durationInFrames,
  formatTime,
  tracks,
  updateClip,
} from "../core/project";
import type { Clip, Project } from "../types";
import { IconButton } from "./ui";

type Props = {
  project: Project;
  selectedId: string | null;
  frame: number;
  onSelect: (id: string) => void;
  onSeek: (frame: number) => void;
  edit: (change: (p: Project) => Project) => void;
  onSplit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};
type Drag = {
  id: string;
  mode: "move" | "left" | "right";
  x: number;
  clip: Clip;
  draft: Clip;
  pointerId: number;
};
export function Timeline({
  project,
  selectedId,
  frame,
  onSelect,
  onSeek,
  edit,
  onSplit,
  onDuplicate,
  onDelete,
}: Props) {
  const [zoom, setZoom] = useState(1.45),
    [snap, setSnap] = useState(true),
    [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null),
    scroller = useRef<HTMLDivElement>(null);
  const px = (zoom * 40) / project.fps;
  const duration = durationInFrames(project),
    total = Math.max(project.fps * 24, duration + project.fps * 4),
    width = total * px;
  const selected = project.clips.find((c) => c.id === selectedId);
  const begin = (event: ReactPointerEvent, clip: Clip, mode: Drag["mode"]) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(clip.id);
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = {
      id: clip.id,
      mode,
      x: event.clientX,
      clip,
      draft: clip,
      pointerId: event.pointerId,
    };
    dragRef.current = next;
    setDrag(next);
  };
  const move = (event: ReactPointerEvent) => {
    const active = dragRef.current;
    if (!active) return;
    let delta = Math.round((event.clientX - active.x) / px);
    const original = active.clip;
    const snapPoint = (value: number) => {
      if (!snap) return value;
      const points = [
        0,
        frame,
        ...project.clips
          .filter((c) => c.id !== original.id)
          .flatMap((c) => [c.start, c.start + c.duration]),
      ];
      const nearest = points.reduce(
        (best, point) =>
          Math.abs(point - value) < Math.abs(best - value) ? point : best,
        Infinity,
      );
      return Math.abs(nearest - value) * px < 8 ? nearest : value;
    };
    let patch: Partial<Clip>;
    if (active.mode === "move") {
      let start = snapPoint(original.start + delta);
      if (start === original.start + delta)
        start = snapPoint(start + original.duration) - original.duration;
      patch = {
        start: Math.max(
          0,
          Math.min(project.fps * 1800 - original.duration, start),
        ),
      };
    } else if (active.mode === "left") {
      delta = snapPoint(original.start + delta) - original.start;
      const asset = project.assets.find((a) => a.id === original.assetId);
      const min =
        asset && asset.kind !== "image"
          ? -Math.min(original.start, original.sourceStart)
          : -original.start;
      delta = Math.max(min, Math.min(original.duration - 1, delta));
      patch = {
        start: original.start + delta,
        duration: original.duration - delta,
        sourceStart: Math.max(0, original.sourceStart + delta),
      };
    } else {
      const end = Math.min(
        project.fps * 1800,
        snapPoint(original.start + original.duration + delta),
      );
      patch = { duration: Math.max(1, end - original.start) };
    }
    const draft = updateClip(project, original.id, patch).clips.find(
      (c) => c.id === original.id,
    )!;
    const next = { ...active, draft };
    dragRef.current = next;
    setDrag(next);
  };
  const end = () => {
    const active = dragRef.current;
    if (
      active &&
      (active.draft.start !== active.clip.start ||
        active.draft.duration !== active.clip.duration ||
        active.draft.sourceStart !== active.clip.sourceStart)
    )
      edit((p) =>
        updateClip(p, active.id, {
          start: active.draft.start,
          duration: active.draft.duration,
          sourceStart: active.draft.sourceStart,
        }),
      );
    dragRef.current = null;
    setDrag(null);
  };
  const cancel = () => {
    dragRef.current = null;
    setDrag(null);
  };
  const keyboardTrim = (
    event: ReactKeyboardEvent,
    clip: Clip,
    side: "left" | "right",
  ) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    let delta =
      (event.key === "ArrowRight" ? 1 : -1) *
      (event.shiftKey ? project.fps : 1);
    if (side === "left") {
      const asset = project.assets.find((a) => a.id === clip.assetId);
      delta = Math.max(
        asset && asset.kind !== "image"
          ? -Math.min(clip.start, clip.sourceStart)
          : -clip.start,
        Math.min(clip.duration - 1, delta),
      );
      edit((p) =>
        updateClip(p, clip.id, {
          start: clip.start + delta,
          duration: clip.duration - delta,
          sourceStart: Math.max(0, clip.sourceStart + delta),
        }),
      );
    } else
      edit((p) =>
        updateClip(p, clip.id, {
          duration: Math.max(
            1,
            Math.min(project.fps * 1800 - clip.start, clip.duration + delta),
          ),
        }),
      );
  };
  const rulerSeek = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(
      Math.max(
        0,
        Math.min(
          duration - 1,
          Math.round(
            (event.clientX - event.currentTarget.getBoundingClientRect().left) /
              px,
          ),
        ),
      ),
    );
  };
  const tickSeconds = zoom < 1 ? 5 : zoom < 2 ? 2 : 1;
  return (
    <section className="timeline" aria-label="多轨时间线">
      <header className="timeline-toolbar">
        <div className="timeline-heading">
          <span className="eyebrow">TIMELINE</span>
          <span>{project.clips.length} 个片段</span>
        </div>
        <div className="tool-group">
          <IconButton
            label="分割片段 (S)"
            onClick={onSplit}
            disabled={
              !selected ||
              frame <= selected.start ||
              frame >= selected.start + selected.duration
            }
          >
            <Scissors />
          </IconButton>
          <IconButton
            label="复制片段"
            onClick={onDuplicate}
            disabled={!selected}
          >
            <Copy />
          </IconButton>
          <IconButton
            label="删除片段 (Delete)"
            onClick={onDelete}
            disabled={!selected}
            className="danger"
          >
            <Trash2 />
          </IconButton>
          <span className="tool-divider" />
          <IconButton
            label={snap ? "关闭吸附" : "启用吸附"}
            aria-pressed={snap}
            onClick={() => setSnap(!snap)}
          >
            <Magnet />
          </IconButton>
        </div>
        <div className="zoom-control">
          <IconButton
            label="缩小时间线"
            onClick={() => setZoom((v) => Math.max(0.35, v - 0.25))}
            disabled={zoom <= 0.35}
          >
            <Minus />
          </IconButton>
          <input
            aria-label="时间线缩放"
            type="range"
            min=".35"
            max="4"
            step=".05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <IconButton
            label="放大时间线"
            onClick={() => setZoom((v) => Math.min(4, v + 0.25))}
            disabled={zoom >= 4}
          >
            <Plus />
          </IconButton>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
      </header>
      <div className="timeline-body">
        <div className="track-labels">
          <div className="ruler-label">轨道</div>
          {tracks.map((track) => (
            <div className={`track-label track-${track.id}`} key={track.id}>
              {track.id === "titles" ? (
                <Type />
              ) : track.id === "captions" ? (
                <Captions />
              ) : track.id === "audio" ? (
                <Volume2 />
              ) : (
                <Image />
              )}
              <span>{track.name}</span>
              <small>{track.short}</small>
            </div>
          ))}
        </div>
        <div className="timeline-scroll" ref={scroller}>
          <div className="timeline-content" style={{ width }}>
            <div
              className="time-ruler"
              onPointerDown={rulerSeek}
              onPointerMove={(e) => {
                if (e.buttons === 1) rulerSeek(e);
              }}
              role="slider"
              aria-label="播放位置"
              aria-valuemin={0}
              aria-valuemax={duration - 1}
              aria-valuenow={frame}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  onSeek(
                    Math.min(
                      duration - 1,
                      Math.max(0, frame + (e.key === "ArrowRight" ? 1 : -1)),
                    ),
                  );
                }
              }}
            >
              {Array.from(
                { length: Math.ceil(total / project.fps / tickSeconds) },
                (_, i) => (
                  <span
                    key={i}
                    className="time-tick"
                    style={{ left: i * tickSeconds * project.fps * px }}
                  >
                    {String(Math.floor((i * tickSeconds) / 60)).padStart(
                      2,
                      "0",
                    )}
                    :{String((i * tickSeconds) % 60).padStart(2, "0")}
                  </span>
                ),
              )}
            </div>
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`track-lane track-${track.id}`}
                style={{
                  backgroundSize: `${tickSeconds * project.fps * px}px 100%`,
                }}
                onDoubleClick={(e) =>
                  onSeek(
                    Math.min(
                      duration - 1,
                      Math.max(
                        0,
                        Math.round(
                          (e.clientX -
                            e.currentTarget.getBoundingClientRect().left) /
                            px,
                        ),
                      ),
                    ),
                  )
                }
              >
                {!project.clips.some((c) => c.trackId === track.id) && (
                  <span className="empty-track">
                    {track.id === "audio"
                      ? "导入音频，加入声音"
                      : track.id === "video"
                        ? "添加视频或图片素材"
                        : track.id === "captions"
                          ? "导入 SRT 或转录生成字幕"
                          : "添加标题，讲述你的故事"}
                  </span>
                )}
                {project.clips
                  .filter((c) => c.trackId === track.id)
                  .map((original) => {
                    const clip =
                        drag?.id === original.id ? drag.draft : original,
                      asset = project.assets.find((a) => a.id === clip.assetId);
                    return (
                      <div
                        key={clip.id}
                        className={`timeline-clip ${selectedId === clip.id ? "selected" : ""} tone-${clip.tone} ${drag?.id === clip.id ? "dragging" : ""}`}
                        style={{
                          left: clip.start * px,
                          width: Math.max(8, clip.duration * px),
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${clip.name}，${formatTime(clip.start, project.fps)}，时长 ${formatTime(clip.duration, project.fps)}`}
                        aria-pressed={selectedId === clip.id}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onSelect(clip.id);
                            onSeek(clip.start);
                          }
                        }}
                        onPointerDown={(e) => begin(e, clip, "move")}
                        onPointerMove={move}
                        onPointerUp={end}
                        onPointerCancel={cancel}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onSeek(clip.start);
                        }}
                      >
                        <button
                          className="trim-handle left"
                          aria-label={`修剪 ${clip.name} 的起点`}
                          title="拖动或使用左右方向键修剪起点"
                          onKeyDown={(e) => keyboardTrim(e, clip, "left")}
                          onPointerDown={(e) => begin(e, clip, "left")}
                        />
                        <div className="clip-content">
                          {clip.kind === "title" ? (
                            <Type />
                          ) : clip.kind === "caption" ? (
                            <Captions />
                          ) : asset?.kind === "audio" ? (
                            <Volume2 />
                          ) : (
                            <Image />
                          )}
                          <span>{clip.name}</span>
                          <small>
                            {(clip.duration / project.fps).toFixed(1)}s
                          </small>
                        </div>
                        {asset?.waveform && (
                          <svg
                            className="waveform"
                            viewBox="0 0 256 22"
                            preserveAspectRatio="none"
                            aria-label="真实音频波形"
                          >
                            {asset.waveform.map((value, i) => (
                              <line
                                key={i}
                                x1={i * 2}
                                x2={i * 2}
                                y1={11 - value * 10}
                                y2={11 + value * 10}
                              />
                            ))}
                          </svg>
                        )}
                        <button
                          className="trim-handle right"
                          aria-label={`修剪 ${clip.name} 的终点`}
                          title="拖动或使用左右方向键修剪终点"
                          onKeyDown={(e) => keyboardTrim(e, clip, "right")}
                          onPointerDown={(e) => begin(e, clip, "right")}
                        />
                      </div>
                    );
                  })}
              </div>
            ))}
            <div
              className="playhead"
              style={{ left: frame * px }}
              aria-hidden="true"
            >
              <span />
            </div>
          </div>
        </div>
      </div>
      <footer className="timeline-footer">
        <span>
          <span className="status-dot" />
          以帧为单位 · {project.fps} FPS
        </span>
        <span>Space 播放 · S 分割 · ⌘Z 撤销</span>
        <span>
          {project.width} × {project.height}
          <i />
          总时长 {formatTime(duration, project.fps)}
        </span>
      </footer>
    </section>
  );
}
