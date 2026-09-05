import { z } from "zod";
import type { Asset, CaptionSegment, Clip, Project, TrackId } from "../types";

const frame = z
  .number()
  .int()
  .nonnegative()
  .max(30 * 60 * 120);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
export const assetSchema = z.object({
  id,
  name: z.string().min(1).max(240),
  kind: z.enum(["video", "audio", "image"]),
  src: z.string().max(2048),
  duration: z.number().positive().max(3600),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  waveform: z.array(z.number().min(0).max(1)).max(512).optional(),
});
export const clipSchema = z.object({
  id,
  trackId: z.enum(["video", "titles", "captions", "audio"]),
  kind: z.enum(["media", "title", "caption"]),
  name: z.string().max(240),
  assetId: id.optional(),
  start: frame,
  duration: frame.min(1),
  sourceStart: frame,
  text: z.string().max(10000),
  motion: z.enum(["none", "fade", "rise", "drift"]),
  volume: z.number().min(0).max(2),
  opacity: z.number().min(0).max(1),
  scale: z.number().min(0.1).max(4),
  x: z.number().min(-100).max(100),
  y: z.number().min(-100).max(100),
  fontSize: z.number().min(12).max(200),
  tone: z.enum(["clay", "sage", "ink"]),
});
export const projectSchema = z
  .object({
    version: z.literal(1),
    id,
    name: z.string().min(1).max(240),
    fps: z.union([z.literal(24), z.literal(25), z.literal(30), z.literal(60)]),
    width: z
      .number()
      .int()
      .min(240)
      .max(3840)
      .refine((n) => n % 2 === 0),
    height: z
      .number()
      .int()
      .min(240)
      .max(3840)
      .refine((n) => n % 2 === 0),
    assets: z.array(assetSchema).max(500),
    clips: z.array(clipSchema).max(3000),
    updatedAt: z.string().datetime(),
    dsh: z
      .object({
        workspacePath: z.string().min(1).max(4096),
        sessionId: z.string().min(1).max(240),
      })
      .optional(),
  })
  .superRefine((project, ctx) => {
    const ids = new Set<string>();
    for (const item of [...project.assets, ...project.clips]) {
      if (ids.has(item.id))
        ctx.addIssue({ code: "custom", message: "素材与片段 ID 必须唯一" });
      ids.add(item.id);
    }
    for (const clip of project.clips) {
      const asset = project.assets.find((item) => item.id === clip.assetId);
      if (clip.kind === "media" && !asset)
        ctx.addIssue({
          code: "custom",
          message: `片段 ${clip.name} 引用了缺失的素材`,
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
          message: `片段 ${clip.name} 超出了源素材时长`,
        });
      if (clip.start + clip.duration > project.fps * 1800)
        ctx.addIssue({ code: "custom", message: "当前单工程最长支持 30 分钟" });
      if (
        clip.kind === "media" &&
        asset &&
        (asset.kind === "audio"
          ? clip.trackId !== "audio"
          : clip.trackId !== "video")
      )
        ctx.addIssue({ code: "custom", message: "素材与轨道类型不匹配" });
      if (
        (clip.kind === "title" && clip.trackId !== "titles") ||
        (clip.kind === "caption" && clip.trackId !== "captions")
      )
        ctx.addIssue({ code: "custom", message: "文字与轨道类型不匹配" });
    }
  });
export const uid = () => crypto.randomUUID();
export const tracks: { id: TrackId; name: string; short: string }[] = [
  { id: "titles", name: "标题与动效", short: "T1" },
  { id: "captions", name: "字幕", short: "C1" },
  { id: "video", name: "画面", short: "V1" },
  { id: "audio", name: "音频", short: "A1" },
];
export const durationInFrames = (project: Project) =>
  Math.max(1, ...project.clips.map((clip) => clip.start + clip.duration));
export function createClip(overrides: Partial<Clip> = {}): Clip {
  return {
    id: uid(),
    trackId: "titles",
    kind: "title",
    name: "新的标题",
    start: 0,
    duration: 150,
    sourceStart: 0,
    text: "让灵感，成为作品。",
    motion: "rise",
    volume: 1,
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    fontSize: 92,
    tone: "clay",
    ...overrides,
  };
}
export function createProject(demo = true): Project {
  return {
    version: 1,
    id: uid(),
    name: demo ? "灵感成片 · 开场练习" : "未命名作品",
    fps: 30,
    width: 1920,
    height: 1080,
    assets: [],
    clips: demo
      ? [
          createClip({ name: "开场 · 灵感成片", duration: 180 }),
          createClip({
            name: "第二幕 · 每一帧",
            text: "每一帧，都有表达。",
            start: 180,
            duration: 180,
            tone: "sage",
            motion: "drift",
          }),
          createClip({
            name: "片尾 · 即刻创作",
            text: "现在，开始创作。",
            start: 360,
            duration: 120,
            tone: "ink",
            motion: "fade",
          }),
        ]
      : [],
    updatedAt: new Date().toISOString(),
  };
}
export function addAssetClip(
  project: Project,
  asset: Asset,
  start?: number,
): Project {
  const trackId = asset.kind === "audio" ? "audio" : "video";
  const at =
    start ??
    Math.max(
      0,
      ...project.clips
        .filter((c) => c.trackId === trackId)
        .map((c) => c.start + c.duration),
    );
  const clip = createClip({
    kind: "media",
    trackId,
    assetId: asset.id,
    name: asset.name,
    text: "",
    motion: "none",
    start: at,
    duration:
      asset.kind === "image"
        ? project.fps * 5
        : Math.max(1, Math.floor(asset.duration * project.fps)),
  });
  return {
    ...project,
    assets: project.assets.some((a) => a.id === asset.id)
      ? project.assets
      : [...project.assets, asset],
    clips: [...project.clips, clip],
  };
}
export function splitClip(
  project: Project,
  clipId: string,
  at: number,
): Project {
  if (!Number.isFinite(at)) return project;
  at = Math.round(at);
  const clip = project.clips.find((c) => c.id === clipId);
  if (!clip || at <= clip.start || at >= clip.start + clip.duration)
    return project;
  const offset = Math.round(at) - clip.start;
  return {
    ...project,
    clips: project.clips.flatMap((c) =>
      c.id !== clipId
        ? [c]
        : [
            { ...c, duration: offset },
            {
              ...c,
              id: uid(),
              start: at,
              duration: c.duration - offset,
              sourceStart: c.sourceStart + offset,
            },
          ],
    ),
  };
}
export function updateClip(
  project: Project,
  clipId: string,
  patch: Partial<Clip>,
): Project {
  return {
    ...project,
    clips: project.clips.map((c) => {
      if (c.id !== clipId) return c;
      const next = { ...c, ...patch, id: c.id };
      next.start = Math.max(0, Math.round(next.start));
      next.sourceStart = Math.max(0, Math.round(next.sourceStart));
      next.duration = Math.max(1, Math.round(next.duration));
      const asset = project.assets.find((a) => a.id === c.assetId);
      if (asset && asset.kind !== "image") {
        const end = Math.max(1, Math.floor(asset.duration * project.fps));
        next.sourceStart = Math.min(next.sourceStart, end - 1);
        next.duration = Math.min(next.duration, end - next.sourceStart);
      }
      return next;
    }),
  };
}
export function captionsToClips(
  segments: CaptionSegment[],
  fps: number,
  offset = 0,
): Clip[] {
  return segments
    .filter(
      (s) =>
        Number.isFinite(s.start) &&
        Number.isFinite(s.end) &&
        s.start >= 0 &&
        s.end > s.start &&
        s.text.trim(),
    )
    .map((s) => {
      const start = Math.max(0, Math.round(s.start * fps) + Math.round(offset));
      const end = Math.round(s.end * fps) + Math.round(offset);
      return createClip({
        kind: "caption",
        trackId: "captions",
        name: s.text.slice(0, 32),
        text: s.text,
        start,
        duration: Math.max(1, end - start),
        fontSize: 48,
        tone: "ink",
        motion: "none",
      });
    });
}
export function formatTime(frames: number, fps = 30): string {
  const f = Math.max(0, Math.round(frames));
  return `${String(Math.floor(f / fps / 60)).padStart(2, "0")}:${String(Math.floor(f / fps) % 60).padStart(2, "0")}:${String(f % fps).padStart(2, "0")}`;
}
