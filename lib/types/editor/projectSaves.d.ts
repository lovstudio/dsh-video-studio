import type { Project } from "../types";
export type SaveState = {
    status: "saved" | "pending" | "saving" | "error" | "conflict";
    message?: string;
};
export interface ProjectRecovery {
    project: Project;
    revision?: string | null;
    dirty: boolean;
}
export interface ProjectSaveRecord extends ProjectRecovery {
    state: SaveState;
    error?: Error;
}
interface SaveTransport {
    read(id: string): Promise<Project>;
    write(project: Project, revision: string | null): Promise<Project>;
}
/** A revision belongs to one document's editing branch, never to an arbitrary loaded snapshot. */
export declare class ProjectSaves {
    private readonly transport;
    private records;
    private pending;
    private running;
    private listeners;
    constructor(transport: SaveTransport, recoveries: ProjectRecovery[]);
    get(id: string): ProjectSaveRecord;
    subscribe(listener: (record: ProjectSaveRecord) => void): () => void;
    private changed;
    get hasUnsaved(): boolean;
    /** Switching back restores an unsaved branch; other snapshots must establish their own base. */
    open(project: Project): ProjectSaveRecord;
    edit(project: Project): void;
    enqueue(id: string): Promise<void>;
    private flush;
    save(id: string): Promise<Project>;
    settled(): Promise<void>;
    accept(remote: Project, force?: boolean): boolean;
}
export {};
