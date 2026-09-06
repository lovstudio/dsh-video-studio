import type { Project } from "../types";
import type { ProjectRecovery } from "./projectSaves";
export type EditorStart = {
    scope?: {
        sessionId: string;
        workspacePath: string;
        sessionTitle?: string;
    };
    projects?: Project[];
};
export interface StoredProjectRecovery {
    activeId?: string;
    selectionMode?: "automatic" | "explicit";
    records: ProjectRecovery[];
}
type RecoveryStorage = Pick<Storage, "length" | "key" | "getItem">;
export declare function projectRecoveryKey(scope?: EditorStart["scope"]): string;
/** Read legacy storage without removing it; an invalid record cannot hide other drafts. */
export declare function readProjectRecovery(storage: RecoveryStorage, scope?: EditorStart["scope"]): StoredProjectRecovery;
/** Unbound legacy drafts stay recoverable; only a recorded user choice can open one by default. */
export declare function selectProjectRecovery(start: EditorStart, stored: StoredProjectRecovery, blank: Project): {
    active: ProjectRecovery;
    records: ProjectRecovery[];
    fresh: boolean;
    selectionMode: "automatic" | "explicit";
};
export {};
