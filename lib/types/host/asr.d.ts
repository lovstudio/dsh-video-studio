import type { CaptionSegment, StudioCapabilities } from "../types";
import type { StoredAsset } from "./storage";
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
export declare function parseSegments(value: unknown): CaptionSegment[];
/** ASR seam shared by plugin providers and the HTTP transcription consumer. */
export declare class AsrRegistry {
    readonly selected: string;
    private providers;
    constructor(selected: string);
    register(provider: AsrProvider): () => void;
    capabilities(): StudioCapabilities["asr"];
    resolve(): AsrProvider;
    clear(): void;
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
export declare function openAiAsrProvider(config: OpenAiAsrConfig): AsrProvider;
