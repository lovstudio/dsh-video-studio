import type { Project } from "../types";
type Props = {
    project: Project;
    selectedId: string | null;
    frame: number;
    onSelect: (id: string) => void;
    onSeek: (frame: number) => void;
    edit: (change: (p: Project) => Project) => void;
    onSplit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
};
export declare function Timeline({ project, selectedId, frame, onSelect, onSeek, edit, onSplit, onDuplicate, onDelete, }: Props): import("react").JSX.Element;
export {};
