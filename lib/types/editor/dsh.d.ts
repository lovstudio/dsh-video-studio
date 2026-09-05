export declare const embedded: boolean;
export interface DshContext {
    sessionId: string;
    workspacePath: string;
    workspaceName?: string;
    sessionTitle?: string;
}
export declare function useDsh(): {
    embedded: boolean;
    context: DshContext | undefined;
    draft: (text: string, projectId: string) => void;
    draftState: "error" | "ready" | "pending" | "idle";
    message: string;
};
