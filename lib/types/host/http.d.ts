import type { IncomingMessage, ServerResponse } from "node:http";
/** An expected request failure whose message is safe to show to the editor. */
export declare class HttpError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export declare const PREFIX = "/video-studio";
export declare const SAFE_ID: RegExp;
export declare function assertId(id: string): string;
export declare function json(res: ServerResponse, status: number, value: unknown): void;
export declare function readJson(req: IncomingMessage, maxBytes?: number): Promise<unknown>;
export declare const mimeType: (path: string) => string;
/** Resolve a static path without allowing symlink or traversal escapes. */
export declare function containedFile(root: string, relative: string): Promise<string>;
/** Serve one owner-selected file with byte ranges; callers own authentication. */
export declare function serveFile(req: IncomingMessage, res: ServerResponse, path: string, options?: {
    download?: string;
    immutable?: boolean;
}): Promise<void>;
/** Only the exact developer origin can reach its loopback server. */
export declare function devRequestRejection(req: IncomingMessage, port: number): number | undefined;
