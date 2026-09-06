import type { Asset, AssetKind } from "../types";
export declare const API = "/video-studio/api";
export declare class StudioApiError extends Error {
    readonly status: number;
    constructor(message: string, status: number);
}
export declare function request<T>(path: string, init?: RequestInit): Promise<T>;
export declare function download(content: string, name: string, type?: string): void;
export declare function uploadMedia(file: File, maxBytes: number): Promise<Asset>;
/** Probe local or workspace media without reading the entire file into memory. */
export declare function readMediaMetadata(url: string, kind: AssetKind, name: string): Promise<{
    duration: number;
    width?: number;
    height?: number;
}>;
