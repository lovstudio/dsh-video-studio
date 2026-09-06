import type { IncomingMessage } from "node:http";
import type { Readable } from "node:stream";
import type { Asset, AssetKind, Project } from "../types";
export declare const MAX_UPLOAD_BYTES: number;
export declare function mediaKind(name: string): AssetKind | undefined;
export interface StoredAsset {
    asset: Asset;
    file: string;
    bytes: number;
}
/** Same-directory rename publishes a complete document at one commit point. */
export declare function atomicJson(path: string, value: unknown): Promise<void>;
/** Owns trusted asset locations and serializes project commits in request order. */
export declare class StudioStore {
    readonly root: string;
    private writes;
    constructor(dataDir: string);
    init(): Promise<void>;
    private directory;
    exportPath(id: string): string;
    asset(id: string): Promise<StoredAsset>;
    canonicalProject(value: unknown): Promise<Project>;
    projects(): Promise<Project[]>;
    project(id: string): Promise<Project>;
    saveProject(id: string, value: unknown, expectedUpdatedAt?: string | null): Promise<Project>;
    upload(req: IncomingMessage | (Readable & {
        headers: IncomingMessage["headers"];
    }), query: URLSearchParams, signal: AbortSignal, maxBytes?: number): Promise<Asset>;
    importFile(path: string, query: URLSearchParams, signal: AbortSignal, maxBytes?: number): Promise<Asset>;
    dispose(): Promise<void>;
}
