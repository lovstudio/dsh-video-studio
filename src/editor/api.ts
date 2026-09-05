import type { Asset, AssetKind } from "../types";

export const API = "/video-studio/api";
export class StudioApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API}/${path}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(120_000),
    headers: {
      ...(init.body && typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new StudioApiError(
      data?.error || data?.message || `请求失败 (${response.status})`,
      response.status,
    );
  return data as T;
}
export function download(
  content: string,
  name: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function uploadMedia(
  file: File,
  maxBytes: number,
): Promise<Asset> {
  if (file.size > maxBytes)
    throw new Error(
      `${file.name} 超过上传上限 (${Math.round(maxBytes / 1024 / 1024)} MB)`,
    );
  const kind: AssetKind | undefined = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("audio/")
      ? "audio"
      : file.type.startsWith("image/")
        ? "image"
        : undefined;
  if (!kind) throw new Error(`暂不支持 ${file.name} 的文件格式`);
  const url = URL.createObjectURL(file);
  let duration = 5,
    width: number | undefined,
    height: number | undefined;
  try {
    if (kind === "image") {
      const img = new Image();
      img.src = url;
      await img.decode();
      width = img.naturalWidth;
      height = img.naturalHeight;
    } else {
      const media = document.createElement(
        kind === "video" ? "video" : "audio",
      );
      media.preload = "metadata";
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          media.removeAttribute("src");
          media.load();
          reject(new Error("读取媒体信息超时"));
        }, 20_000);
        media.onloadedmetadata = () => {
          clearTimeout(timer);
          resolve();
        };
        media.onerror = () => {
          clearTimeout(timer);
          reject(new Error(`浏览器无法读取 ${file.name}`));
        };
        media.src = url;
      });
      duration = media.duration;
      if (media instanceof HTMLVideoElement) {
        width = media.videoWidth;
        height = media.videoHeight;
      }
      media.removeAttribute("src");
      media.load();
      if (!Number.isFinite(duration) || duration <= 0 || duration > 3600)
        throw new Error("请选择时长不超过 60 分钟的有效媒体文件");
    }
  } finally {
    URL.revokeObjectURL(url);
  }
  const params = new URLSearchParams({
    name: file.name,
    kind,
    duration: String(duration),
  });
  if (width && height) {
    params.set("width", String(width));
    params.set("height", String(height));
  }
  const asset = await request<Asset>(`assets?${params}`, {
    method: "POST",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (kind === "audio" && file.size < 32 * 1024 * 1024) {
    const context = new AudioContext();
    try {
      const buffer = await context.decodeAudioData(await file.arrayBuffer());
      const channel = buffer.getChannelData(0),
        buckets = 128,
        step = Math.max(1, Math.floor(channel.length / buckets));
      asset.waveform = Array.from({ length: buckets }, (_, i) => {
        let peak = 0;
        for (
          let j = i * step;
          j < Math.min((i + 1) * step, channel.length);
          j += 16
        )
          peak = Math.max(peak, Math.abs(channel[j]));
        return peak;
      });
    } catch {
      /* Waveforms are optional; the original uploaded audio remains usable. */
    } finally {
      await context.close();
    }
  }
  return asset;
}
