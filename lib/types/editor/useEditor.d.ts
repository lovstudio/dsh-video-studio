import type { Project } from "../types";
import { type SaveState } from "./projectSaves";
export type { SaveState } from "./projectSaves";
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
    saveNow: () => Promise<Project>;
    acceptServer: (remote: Project, force?: boolean) => void;
    reload: () => Promise<void>;
    fresh: import("react").RefObject<boolean>;
};
