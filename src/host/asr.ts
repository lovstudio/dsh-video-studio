import { openAsBlob } from "node:fs";
import { z } from "zod";
import type { CaptionSegment, StudioCapabilities } from "../types";
import type { StoredAsset } from "./storage";
import { HttpError, mimeType } from "./http";

export interface AsrRequest {
  asset: StoredAsset;
  language?: string;
  signal: AbortSignal;
}
/** Providers return bounded, timed segments and honor cancellation before resolving. */
export interface AsrProvider {
  id: string;
  model?: string;
  transcribe(request: AsrRequest): Promise<CaptionSegment[]>;
}

const segmentSchema = z
  .object({
    start: z.number().finite().nonnegative(),
    end: z.number().finite().positive(),
    text: z.string().max(10000),
  })
  .refine((segment) => segment.end > segment.start);
export function parseSegments(value: unknown): CaptionSegment[] {
  return z
    .array(segmentSchema)
    .max(10000)
    .parse(value)
    .filter((segment) => segment.text.trim())
    .sort((a, b) => a.start - b.start);
}

/** ASR seam shared by plugin providers and the HTTP transcription consumer. */
export class AsrRegistry {
  private providers = new Map<string, AsrProvider>();
  constructor(public readonly selected: string) {}
  register(provider: AsrProvider): () => void {
    if (this.providers.has(provider.id))
      throw new Error(`ASR provider already registered: ${provider.id}`);
    this.providers.set(provider.id, provider);
    return () => {
      if (this.providers.get(provider.id) === provider)
        this.providers.delete(provider.id);
    };
  }
  capabilities(): StudioCapabilities["asr"] {
    const provider = this.providers.get(this.selected);
    return {
      configured: provider !== undefined,
      provider: provider?.id ?? this.selected,
      ...(provider?.model ? { model: provider.model } : {}),
    };
  }
  resolve(): AsrProvider {
    const provider = this.providers.get(this.selected);
    if (!provider)
      throw new HttpError(
        503,
        "ASR 尚未配置：请设置服务地址、模型、带时间戳的返回格式和服务端 API Key，或注册本地 provider",
      );
    return provider;
  }
  clear(): void {
    this.providers.clear();
  }
}

export interface OpenAiAsrConfig {
  endpoint: string;
  model: string;
  format: "diarized_json" | "verbose_json";
  apiKey: string;
  timeoutMs: number;
  maxBytes: number;
}

/** Explicit OpenAI-compatible configuration; this adapter never selects a model. */
export function openAiAsrProvider(config: OpenAiAsrConfig): AsrProvider {
  const endpoint = new URL(config.endpoint);
  if (
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    !["https:", "http:"].includes(endpoint.protocol)
  )
    throw new Error("ASR endpoint must be a clean HTTP(S) transcription URL");
  if (
    endpoint.protocol === "http:" &&
    !["127.0.0.1", "localhost", "[::1]"].includes(endpoint.hostname)
  )
    throw new Error("Remote ASR endpoint requires HTTPS");
  if (!config.model.trim() || !config.apiKey.trim())
    throw new Error("ASR model and API key are required");
  return {
    id: "openai-compatible",
    model: config.model,
    async transcribe({ asset, language, signal }) {
      if (asset.asset.kind === "image")
        throw new HttpError(400, "图片不包含可转录的音轨");
      if (asset.bytes > config.maxBytes)
        throw new HttpError(
          413,
          "素材超过 ASR 服务的上传限制；请先压缩或拆分音频",
        );
      signal.throwIfAborted();
      const form = new FormData();
      form.set(
        "file",
        await openAsBlob(asset.file, { type: mimeType(asset.file) }),
        asset.asset.name,
      );
      form.set("model", config.model);
      form.set("response_format", config.format);
      if (config.format === "diarized_json")
        form.set("chunking_strategy", "auto");
      else form.append("timestamp_granularities[]", "segment");
      if (language) form.set("language", language);
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${config.apiKey}` },
          body: form,
          redirect: "error",
          signal: AbortSignal.any([
            signal,
            AbortSignal.timeout(config.timeoutMs),
          ]),
        });
      } catch {
        signal.throwIfAborted();
        throw new HttpError(502, "ASR 服务连接失败或超时，请检查服务配置");
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new HttpError(502, `ASR 服务返回 HTTP ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new HttpError(502, "ASR 服务没有返回内容");
      const parts: Uint8Array[] = [];
      let total = 0;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > 8 * 1024 * 1024)
            throw new HttpError(502, "ASR 返回内容超过限制");
          parts.push(value);
        }
        const body = JSON.parse(Buffer.concat(parts).toString("utf8")) as {
          segments?: unknown;
        };
        return parseSegments(body.segments);
      } catch (error) {
        signal.throwIfAborted();
        if (error instanceof HttpError) throw error;
        throw new HttpError(
          502,
          "ASR 未返回有效的 start / end / text 时间片段，请核对模型和返回格式",
        );
      } finally {
        await reader.cancel();
        reader.releaseLock();
      }
    },
  };
}
