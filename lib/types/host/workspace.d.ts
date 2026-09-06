import type { Project } from "../types";
import type { WorkspaceListing } from "../core/workspace";
export type WorkspaceResolver = (sessionId: string, signal: AbortSignal) => Promise<string | undefined>;
interface SessionHeaders {
    get(id: string): {
        header: {
            cwd?: string;
        };
    } | undefined;
}
interface PersistedHeaders {
    list(signal?: AbortSignal): Promise<readonly {
        id: string;
        cwd?: string;
    }[]>;
}
interface RegisteredWorkspaces {
    list(): readonly {
        path: string;
        sessionIds: readonly string[];
    }[];
}
/** rc.1's metadata API does not read messages or activate an Agent. */
export declare function sessionWorkspace(sessionId: string, signal: AbortSignal, sessions: SessionHeaders, persistence: PersistedHeaders, workspaces?: RegisteredWorkspaces): Promise<string | undefined>;
/** Each request reads one directory, bounded independently of workspace size. */
export declare class WorkspaceFiles {
    private readonly resolver?;
    constructor(resolver?: WorkspaceResolver | undefined);
    root(sessionId: string, signal: AbortSignal): Promise<string>;
    private resolvePath;
    media(sessionId: string, path: string, signal: AbortSignal): Promise<{
        file: string;
        kind: import("../types").AssetKind;
        name: string;
        size: number;
    }>;
    list(sessionId: string, path: string, signal: AbortSignal): Promise<WorkspaceListing>;
    private remotion;
    filterProjects(projects: Project[], sessionId: string, scope: "session" | "workspace", signal: AbortSignal): Promise<Project[]>;
}
export {};
