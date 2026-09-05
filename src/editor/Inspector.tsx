import { AlignCenter, Copy, SlidersHorizontal, Trash2 } from "lucide-react";
import type { Clip, Project } from "../types";
import { formatTime } from "../core/project";
import { Field, IconButton } from "./ui";

export function Inspector({
  project,
  clip,
  patch,
  onDuplicate,
  onDelete,
  resize,
}: {
  project: Project;
  clip?: Clip;
  patch: (change: Partial<Clip>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  resize: (width: number, height: number) => void;
}) {
  const asset = project.assets.find((a) => a.id === clip?.assetId);
  return (
    <aside className="inspector" aria-label="属性面板">
      <header className="panel-heading">
        <h2>属性</h2>
        <SlidersHorizontal size={16} />
      </header>
      <div className="inspector-scroll">
        <section className="inspector-section">
          <div className="section-label">
            <span>画布</span>
            <small>COMPOSITION</small>
          </div>
          <div className="aspect-options">
            {[
              { label: "16:9", width: 1920, height: 1080 },
              { label: "9:16", width: 1080, height: 1920 },
              { label: "1:1", width: 1080, height: 1080 },
            ].map((size) => (
              <button
                key={size.label}
                title={`画布比例 ${size.label}`}
                aria-pressed={
                  project.width / project.height === size.width / size.height
                }
                onClick={() => resize(size.width, size.height)}
              >
                <span
                  className="aspect-shape"
                  style={{ aspectRatio: size.width / size.height }}
                />
                {size.label}
              </button>
            ))}
          </div>
          <p className="dimension-note">
            {project.width} × {project.height} <span>{project.fps} fps</span>
          </p>
        </section>
        {clip ? (
          <>
            <section className="inspector-section">
              <div className="section-label">
                <span>
                  {clip.kind === "media"
                    ? "素材片段"
                    : clip.kind === "caption"
                      ? "字幕内容"
                      : "标题内容"}
                </span>
                <small>{clip.kind.toUpperCase()}</small>
              </div>
              <Field label="片段名称">
                <input
                  value={clip.name}
                  aria-label="片段名称"
                  maxLength={240}
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </Field>
              {clip.kind !== "media" && (
                <Field label="文字">
                  <textarea
                    aria-label="片段文字"
                    rows={3}
                    maxLength={10000}
                    value={clip.text}
                    onChange={(e) => patch({ text: e.target.value })}
                  />
                </Field>
              )}
              <div className="field-pair">
                <Field label="起点" hint="秒">
                  <input
                    type="number"
                    aria-label="片段起点秒数"
                    min="0"
                    max="1800"
                    step={1 / project.fps}
                    value={Number((clip.start / project.fps).toFixed(2))}
                    onChange={(e) => {
                      if (e.target.value !== "")
                        patch({
                          start: Math.min(
                            project.fps * 1800 - clip.duration,
                            Number(e.target.value) * project.fps,
                          ),
                        });
                    }}
                  />
                </Field>
                <Field label="时长" hint="秒">
                  <input
                    type="number"
                    aria-label="片段时长秒数"
                    min={1 / project.fps}
                    max={1800 - clip.start / project.fps}
                    step={1 / project.fps}
                    value={Number((clip.duration / project.fps).toFixed(2))}
                    onChange={(e) => {
                      if (e.target.value !== "")
                        patch({
                          duration: Math.min(
                            project.fps * 1800 - clip.start,
                            Number(e.target.value) * project.fps,
                          ),
                        });
                    }}
                  />
                </Field>
              </div>
              <p className="dimension-note">
                {formatTime(clip.start, project.fps)}{" "}
                <span>
                  → {formatTime(clip.start + clip.duration, project.fps)}
                </span>
              </p>
            </section>
            {asset?.kind !== "audio" && (
              <section className="inspector-section">
                <div className="section-label">
                  <span>画面与位置</span>
                  <IconButton
                    label="重置位置与缩放"
                    onClick={() => patch({ x: 0, y: 0, scale: 1 })}
                  >
                    <AlignCenter />
                  </IconButton>
                </div>
                <Field label="缩放" hint={`${Math.round(clip.scale * 100)}%`}>
                  <input
                    type="range"
                    aria-label="片段缩放"
                    min=".1"
                    max="4"
                    step=".01"
                    value={clip.scale}
                    onChange={(e) => patch({ scale: Number(e.target.value) })}
                  />
                </Field>
                <Field
                  label="不透明度"
                  hint={`${Math.round(clip.opacity * 100)}%`}
                >
                  <input
                    type="range"
                    aria-label="不透明度"
                    min="0"
                    max="1"
                    step=".01"
                    value={clip.opacity}
                    onChange={(e) => patch({ opacity: Number(e.target.value) })}
                  />
                </Field>
                <div className="field-pair">
                  <Field label="横向位置" hint="%">
                    <input
                      aria-label="横向位置"
                      type="number"
                      min="-100"
                      max="100"
                      value={clip.x}
                      onChange={(e) =>
                        patch({
                          x: Math.max(
                            -100,
                            Math.min(100, Number(e.target.value)),
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="纵向位置" hint="%">
                    <input
                      aria-label="纵向位置"
                      type="number"
                      min="-100"
                      max="100"
                      value={clip.y}
                      onChange={(e) =>
                        patch({
                          y: Math.max(
                            -100,
                            Math.min(100, Number(e.target.value)),
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
              </section>
            )}
            {clip.kind !== "media" && (
              <section className="inspector-section">
                <div className="section-label">
                  <span>文字样式</span>
                  <small>TYPOGRAPHY</small>
                </div>
                <Field label="字号" hint={`${clip.fontSize} px`}>
                  <input
                    type="range"
                    aria-label="文字字号"
                    min="12"
                    max="200"
                    step="1"
                    value={clip.fontSize}
                    onChange={(e) =>
                      patch({ fontSize: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="色调">
                  <div className="tone-options">
                    {(
                      [
                        { id: "clay", name: "陶土" },
                        { id: "sage", name: "鼠尾草" },
                        { id: "ink", name: "石墨" },
                      ] as const
                    ).map((tone) => (
                      <button
                        key={tone.id}
                        className={`tone-swatch tone-${tone.id}`}
                        aria-label={`${tone.name}色调`}
                        title={`${tone.name}色调`}
                        aria-pressed={clip.tone === tone.id}
                        onClick={() => patch({ tone: tone.id })}
                      >
                        <span />
                        {tone.name}
                      </button>
                    ))}
                  </div>
                </Field>
              </section>
            )}
            {asset?.kind !== "audio" && (
              <section className="inspector-section">
                <div className="section-label">
                  <span>入场动效</span>
                  <small>MOTION</small>
                </div>
                <select
                  aria-label="入场动效"
                  value={clip.motion}
                  onChange={(e) =>
                    patch({ motion: e.target.value as Clip["motion"] })
                  }
                >
                  <option value="none">无动效</option>
                  <option value="fade">柔和淡入</option>
                  <option value="rise">向上浮现</option>
                  <option value="drift">缓慢推近</option>
                </select>
              </section>
            )}
            {asset && asset.kind !== "image" && (
              <section className="inspector-section">
                <div className="section-label">
                  <span>声音</span>
                  <small>AUDIO</small>
                </div>
                <Field label="音量" hint={`${Math.round(clip.volume * 100)}%`}>
                  <input
                    type="range"
                    aria-label="片段音量"
                    min="0"
                    max="2"
                    step=".01"
                    value={clip.volume}
                    onChange={(e) => patch({ volume: Number(e.target.value) })}
                  />
                </Field>
                <p className="help-text">
                  {clip.volume === 0
                    ? "该片段已静音"
                    : "原始素材声音 · 可独立调节"}
                </p>
              </section>
            )}
            <div className="inspector-actions">
              <button className="text-button" onClick={onDuplicate}>
                <Copy />
                复制片段
              </button>
              <button className="text-button danger" onClick={onDelete}>
                <Trash2 />
                删除片段
              </button>
            </div>
          </>
        ) : (
          <div className="selection-empty">
            <SlidersHorizontal />
            <h3>让细节就位</h3>
            <p>
              选择时间线上的片段，
              <br />
              调整文字、画面与声音。
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
