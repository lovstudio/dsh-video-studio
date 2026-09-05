import type { Asset } from "../types";
export declare const API = "/video-studio/api";
export declare function request<T>(path: string, init?: RequestInit): Promise<T>;
export declare function download(content: string, name: string, type?: string): void;
export declare function uploadMedia(file: File, maxBytes: number): Promise<Asset>;
