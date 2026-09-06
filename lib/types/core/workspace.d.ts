import type { AssetKind } from "../types";
export interface WorkspaceEntry {
    name: string;
    /** A slash-separated path relative to the trusted session workspace. */
    path: string;
    kind: "directory" | AssetKind;
    size?: number;
    modifiedAt?: string;
}
export interface WorkspaceListing {
    sessionId: string;
    workspacePath: string;
    workspaceName: string;
    path: string;
    parentPath: string | null;
    entries: WorkspaceEntry[];
    truncated: boolean;
    /** Detection only: arbitrary Remotion source is never executed or converted. */
    remotion?: {
        packageName?: string;
    };
}
export interface WorkspaceImport {
    sessionId: string;
    path: string;
    duration: number;
    width?: number;
    height?: number;
}
export declare function workspaceMediaUrl(sessionId: string, path: string): string;
