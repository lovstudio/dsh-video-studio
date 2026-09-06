import type { Project } from "../types";
import { type SaveState } from "./projectSaves";
import { type EditorStart } from "./projectRecovery";
export type { SaveState } from "./projectSaves";
export type { EditorStart } from "./projectRecovery";
export declare function useEditor(start?: EditorStart): {
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
    recoveries: Project[];
};
