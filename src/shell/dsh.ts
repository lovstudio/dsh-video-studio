import type { ComponentType } from "react";
import type { Context } from "@deepseek-ai/cordis";

/** Structural subset of the installed DSH 0.1.2-rc.1 public client contracts. */
export type Selector<T> = <R>(
  select: (value: T) => R,
  equal?: (left: R, right: R) => boolean,
) => R;
export interface Workspace {
  workspaceId: string;
  path: string;
  title: string;
  sessionIds: readonly string[];
}
export interface SessionSummary {
  id: string;
  displayTitle: string;
  title?: string;
  cwd: string;
  blank: boolean;
}
export interface SessionList {
  current: string | undefined;
  ids: readonly string[];
  byId: Record<string, SessionSummary>;
}
export interface Workspaces {
  items: readonly Workspace[];
  phase: "pending" | "ready";
}
export interface SessionSnapshot {
  blank: boolean;
  running: boolean;
  awaitingFirstTurn: boolean;
  promptAttempted: boolean;
}
export interface InputSnapshot {
  draft: string;
  phase: "plain" | "adjudicating" | "claimed" | "submitting";
}
export interface StandardProps {
  useSessions: Selector<SessionList>;
  useWorkspaces: Selector<Workspaces>;
}
export interface SessionProps extends StandardProps {
  sessionId: string;
  useSession: Selector<SessionSnapshot>;
  useConversation: Selector<{ activeTargets: ReadonlySet<string> }>;
  useInput: Selector<InputSnapshot>;
  inputActions: { setDraft(text: string): void };
}
export interface Slots {
  inject(name: string, register: () => () => void): unknown;
  register<P>(
    options: {
      name: string;
      id: string;
      order?: number;
      locale?: string;
      label?: () => string;
      inject?: (sessionId: string) => object;
    },
    component: ComponentType<P>,
  ): () => void;
}
export interface Locale {
  register(
    namespace: string,
    dictionaries: Record<string, Record<string, string>>,
  ): () => void;
  bind(namespace: string): (key: string) => string;
}
export interface Sessions {
  list: { getSnapshot(): SessionList };
  scope(id: string): Context | undefined;
  open(id: string): void;
}
export interface WorkspaceNavigation {
  connectWorkspace(id: string): Promise<string>;
}
export interface Conversation {
  input: { for(scope: Context): { state: { getSnapshot(): InputSnapshot } } };
}
export interface HostContext {
  sessionId: string;
  workspacePath?: string;
  workspaceName?: string;
  sessionTitle?: string;
}

/** Preserve the user's exact draft, and make a repeated bridge delivery idempotent. */
export function appendStudioDraft(draft: string, text: string): string {
  const incoming = text.trim();
  if (!incoming) throw new Error("empty-draft");
  if (draft === incoming || draft.endsWith(`\n\n---\n\n${incoming}`))
    return draft;
  return draft.trim() ? `${draft}\n\n---\n\n${incoming}` : incoming;
}

/** Mirrors DSH's public conversationPhase rule without plugin-to-plugin value imports. */
export function isBlankConversation(
  session: SessionSnapshot,
  activeTargets: ReadonlySet<string>,
): boolean {
  return (
    session.blank &&
    !session.running &&
    !session.promptAttempted &&
    activeTargets.size === 0
  );
}
