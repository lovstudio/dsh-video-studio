import type { Clip, Project } from "../types";
export declare function Inspector({ project, clip, patch, onDuplicate, onDelete, resize, }: {
    project: Project;
    clip?: Clip;
    patch: (change: Partial<Clip>) => void;
    onDuplicate: () => void;
    onDelete: () => void;
    resize: (width: number, height: number) => void;
}): import("react").JSX.Element;
