import type { Asset } from "../types";
import "./workspace.css";
export declare function WorkspaceMedia({ sessionId, maxBytes, onImport, }: {
    sessionId: string;
    maxBytes: number;
    onImport(asset: Asset): void;
}): import("react").JSX.Element;
