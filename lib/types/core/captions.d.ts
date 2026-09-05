import type { CaptionSegment, Project } from "../types";
export declare function parseSrt(text: string): CaptionSegment[];
export declare function exportSrt(project: Project): string;
