import type { Project } from "../types";
export type SaveState = {
    status: "saved" | "pending" | "saving" | "error";
    message?: string;
};
export declare function useEditor(): {
    project: Project;
    edit: (change: (value: Project) => Project) => void;
    undo: () => void;
    redo: () => void;
    history: {
        undo: boolean;
        redo: boolean;
    };
    save: SaveState;
    retry: () => void;
    load: (next: Project) => void;
    current: import("react").RefObject<Project>;
};
