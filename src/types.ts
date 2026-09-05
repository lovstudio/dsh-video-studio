export type AssetKind = "video" | "audio" | "image";
export type TrackId = "video" | "titles" | "captions" | "audio";
export type MotionPreset = "none" | "fade" | "rise" | "drift";
export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  src: string;
  duration: number;
  width?: number;
  height?: number;
  waveform?: number[];
}
export interface Clip {
  id: string;
  trackId: TrackId;
  kind: "media" | "title" | "caption";
  name: string;
  assetId?: string;
  start: number;
  duration: number;
  sourceStart: number;
  text: string;
  motion: MotionPreset;
  volume: number;
  opacity: number;
  scale: number;
  x: number;
  y: number;
  fontSize: number;
  tone: "clay" | "sage" | "ink";
}
export interface Project {
  version: 1;
  id: string;
  name: string;
  fps: number;
  width: number;
  height: number;
  assets: Asset[];
  clips: Clip[];
  updatedAt: string;
}
export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
}
export interface StudioCapabilities {
  asr: { configured: boolean; provider: string; model?: string };
  render: { available: boolean };
  maxUploadBytes: number;
}
export interface StudioJob {
  id: string;
  kind: "render" | "asr";
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  message?: string;
  outputUrl?: string;
  segments?: CaptionSegment[];
  createdAt: string;
}
