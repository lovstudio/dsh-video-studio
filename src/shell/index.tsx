import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Context } from "@deepseek-ai/cordis";
import { createSnapshotStore } from "@deepseek-ai/dsh-client-store";
import {
  appendStudioDraft,
  isBlankConversation,
  type Conversation,
  type HostContext,
  type InputSnapshot,
  type Locale,
  type Selector,
  type SessionProps,
  type Sessions,
  type Slots,
  type StandardProps,
  type WorkspaceNavigation,
} from "./dsh";
import { shellStyles } from "./styles";

const CHANNEL = "dsh-video-studio";
const NS = "videoStudio";
interface StudioShellState {
  guideOpen: boolean;
  expanded: Record<string, boolean>;
}
interface CopyProps {
  t(key: string): string;
}
interface ShellProps extends StandardProps, CopyProps {
  wide?: boolean;
  useStudio: Selector<StudioShellState>;
  toggleGuide(): void;
  closeGuide(): void;
  expand(id: string, open: boolean): void;
  connectWorkspace(id: string): Promise<void>;
}
interface ViewProps extends SessionProps, CopyProps {
  readInput(): InputSnapshot;
  isCurrentSession(): boolean;
}
interface DockProps extends ViewProps {
  useStudio: Selector<StudioShellState>;
  expand(id: string, open: boolean): void;
}

/** Standard sources and the scoped input service are ready before any entry mounts. */
export const inject = [
  "slots",
  "locale",
  "sessions",
  "uiSession",
  "uiWorkspace",
  "conversation",
];

function StudioIcon({ size = 18 }: { size?: number }): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M3 10h18M8 5l3 5m3-5 3 5M10 13l5 2.5-5 2.5z" />
    </svg>
  );
}

function Entry({ wide, toggleGuide, useStudio, t }: ShellProps): ReactNode {
  const open = useStudio((s) => s.guideOpen);
  return (
    <button
      type="button"
      className="dsh-vs-entry"
      data-wide={wide || undefined}
      aria-label={t("title")}
      title={wide ? undefined : t("title")}
      aria-expanded={open}
      aria-controls="dsh-vs-guide"
      onClick={toggleGuide}
    >
      <StudioIcon />
      {wide && <span>{t("title")}</span>}
    </button>
  );
}

/** A small, nonmodal native entry card; it never replaces the DSH shell. */
function Guide({
  useStudio,
  useSessions,
  useWorkspaces,
  closeGuide,
  expand,
  connectWorkspace,
  t,
}: ShellProps): ReactNode {
  const open = useStudio((s) => s.guideOpen);
  const current = useSessions((s) =>
    s.current === undefined ? undefined : s.byId[s.current],
  );
  const workspaces = useWorkspaces((s) => s.items);
  const ready = useWorkspaces((s) => s.phase === "ready");
  const [pending, setPending] = useState<string>();
  const [error, setError] = useState<string>();
  const panel = useRef<HTMLElement>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    setError(undefined);
    const escape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closeGuide();
    };
    const outside = (event: PointerEvent): void => {
      if (
        event.target instanceof Element &&
        !panel.current?.contains(event.target) &&
        !event.target.closest(".dsh-vs-entry")
      )
        closeGuide();
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open, closeGuide]);
  if (!open) return null;
  const connect = async (id: string): Promise<void> => {
    if (pending) return;
    setPending(id);
    setError(undefined);
    try {
      await connectWorkspace(id);
    } catch {
      if (alive.current) setError(t("connectError"));
    } finally {
      if (alive.current) setPending(undefined);
    }
  };
  return (
    <aside
      id="dsh-vs-guide"
      className="dsh-vs-guide"
      ref={panel}
      aria-label={t("title")}
    >
      <div className="dsh-vs-row">
        <div className="dsh-vs-heading">
          <StudioIcon />
          {t("title")}
        </div>
        <button
          type="button"
          className="dsh-vs-button"
          data-kind="quiet"
          onClick={closeGuide}
          aria-label={t("close")}
        >
          ×
        </button>
      </div>
      {current ? (
        <>
          <p className="dsh-vs-copy">
            {current.blank ? t("blankGuide") : t("tabGuide")}
          </p>
          <div className="dsh-vs-row">
            <span className="dsh-vs-status">{current.displayTitle}</span>
            <button
              type="button"
              className="dsh-vs-button"
              onClick={() => {
                if (current.blank) expand(current.id, true);
                closeGuide();
              }}
            >
              {current.blank ? t("start") : t("understood")}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="dsh-vs-copy">{t("workspaceGuide")}</p>
          {workspaces.length > 0 ? (
            <div className="dsh-vs-workspaces">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.workspaceId}
                  type="button"
                  className="dsh-vs-workspace"
                  disabled={pending !== undefined}
                  onClick={() => {
                    void connect(workspace.workspaceId);
                  }}
                >
                  <span>
                    {pending === workspace.workspaceId
                      ? t("connecting")
                      : workspace.title}
                  </span>
                  <small title={workspace.path}>{workspace.path}</small>
                </button>
              ))}
            </div>
          ) : (
            <p className="dsh-vs-status">
              {ready ? t("noWorkspaces") : t("loadingWorkspaces")}
            </p>
          )}
        </>
      )}
      {error && (
        <p className="dsh-vs-error" role="alert">
          {error}
        </p>
      )}
    </aside>
  );
}

function StudioFrame(props: ViewProps & { inline?: boolean }): ReactNode {
  const {
    sessionId,
    useSessions,
    useWorkspaces,
    inputActions,
    readInput,
    isCurrentSession,
    t,
    inline,
  } = props;
  const workspace = useWorkspaces((s) =>
    s.items.find((item) => item.sessionIds.includes(sessionId)),
  );
  const sessionTitle = useSessions((s) => s.byId[sessionId]?.displayTitle);
  const context = useMemo<HostContext>(
    () => ({
      sessionId,
      ...(workspace?.path ? { workspacePath: workspace.path } : {}),
      ...(workspace?.title ? { workspaceName: workspace.title } : {}),
      ...(sessionTitle ? { sessionTitle } : {}),
    }),
    [sessionId, workspace?.path, workspace?.title, sessionTitle],
  );
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<string>();
  const latest = useRef({
    context,
    inputActions,
    readInput,
    isCurrentSession,
    t,
  });
  latest.current = { context, inputActions, readInput, isCurrentSession, t };
  const send = (message: object): void =>
    frame.current?.contentWindow?.postMessage(
      { channel: CHANNEL, ...message },
      location.origin,
    );
  useEffect(() => {
    const target = frame.current?.contentWindow;
    const post = (message: object): void =>
      target?.postMessage({ channel: CHANNEL, ...message }, location.origin);
    const activity = (): void =>
      post({ type: document.hidden ? "pause" : "resume" });
    const receive = (event: MessageEvent): void => {
      if (
        event.origin !== location.origin ||
        event.source !== target ||
        !event.data ||
        typeof event.data !== "object" ||
        event.data.channel !== CHANNEL
      )
        return;
      if (event.data.type === "ready") {
        setReady(true);
        post({ type: "context", context: latest.current.context });
        activity();
        return;
      }
      if (event.data.type !== "draft") return;
      const data = event.data;
      let error: string | undefined;
      try {
        if (
          typeof data.text !== "string" ||
          !data.text.trim() ||
          data.text.length > 100_000 ||
          typeof data.projectId !== "string" ||
          !/^[A-Za-z0-9_-]{1,160}$/.test(data.projectId)
        )
          error = latest.current.t("draftInvalid");
        else if (!latest.current.isCurrentSession())
          error = latest.current.t("draftSessionChanged");
        else {
          const input = latest.current.readInput();
          if (input.phase !== "plain") error = latest.current.t("draftBusy");
          else {
            latest.current.inputActions.setDraft(
              appendStudioDraft(input.draft, data.text),
            );
            setStatus(latest.current.t("draftReady"));
          }
        }
      } catch {
        error = latest.current.t("draftUnavailable");
      }
      if (error) setStatus(error);
      post({
        type: "draft-result",
        ok: error === undefined,
        ...(error ? { message: error } : {}),
      });
    };
    window.addEventListener("message", receive);
    document.addEventListener("visibilitychange", activity);
    return () => {
      post({ type: "pause" });
      window.removeEventListener("message", receive);
      document.removeEventListener("visibilitychange", activity);
    };
  }, [sessionId]);
  useEffect(() => {
    send({ type: "context", context });
  }, [context]);
  return (
    <div className="dsh-vs-frame-wrap" data-inline={inline || undefined}>
      <div className="dsh-vs-context">
        <span className="dsh-vs-context-name" title={workspace?.path}>
          <StudioIcon size={14} />
          <span>{workspace?.title || t("sessionWorkspace")}</span>
          {sessionTitle && <span>· {sessionTitle}</span>}
        </span>
        <span className="dsh-vs-status" role="status">
          {status || t("connected")}
        </span>
      </div>
      <iframe
        ref={frame}
        className="dsh-vs-frame"
        title={t("title")}
        src={`/video-studio/?embedded=1&sessionId=${encodeURIComponent(sessionId)}`}
        allow="autoplay; fullscreen"
        onLoad={() => {
          send({ type: "context", context: latest.current.context });
          send({ type: document.hidden ? "pause" : "resume" });
        }}
      />
      {!ready && (
        <div className="dsh-vs-loading" role="status">
          {t("loadingEditor")}
        </div>
      )}
    </div>
  );
}

function VideoView(props: ViewProps): ReactNode {
  return (
    <div className="dsh-vs-native" data-conversation-composer-overlay="">
      <StudioFrame {...props} />
    </div>
  );
}

/** Blank sessions have no native View ring, so the dock is the supported inline surface. */
function BlankDock(props: DockProps): ReactNode {
  const { sessionId, useSession, useConversation, useStudio, expand, t } =
    props;
  const session = useSession((s) => s);
  const targets = useConversation((s) => s.activeTargets);
  const expanded = useStudio((s) => s.expanded[sessionId] === true);
  if (!isBlankConversation(session, targets)) return null;
  return (
    <section
      className="dsh-vs-dock"
      data-expanded={expanded || undefined}
      aria-label={t("title")}
    >
      <div className="dsh-vs-dock-intro">
        <div className="dsh-vs-row">
          <div>
            <div className="dsh-vs-heading">
              <StudioIcon />
              {t("title")}
            </div>
            <p className="dsh-vs-copy">
              {expanded ? t("inlineGuide") : t("blankGuide")}
            </p>
          </div>
          <button
            type="button"
            className="dsh-vs-button"
            onClick={() => expand(sessionId, !expanded)}
          >
            {expanded ? t("collapse") : t("start")}
          </button>
        </div>
      </div>
      {expanded && <StudioFrame key={sessionId} {...props} inline />}
    </section>
  );
}

/** Native conversation View, blank-session dock, and workspace-aware entry. */
export function apply(ctx: Context): void {
  const slots = ctx.get("slots") as Slots;
  const locale = ctx.get("locale") as Locale;
  // Host and Client use the same service key with different process-local faces.
  const sessions = ctx.get("sessions") as unknown as Sessions;
  const workspaceNavigation = ctx.get("uiWorkspace") as WorkspaceNavigation;
  const conversation = ctx.get("conversation") as Conversation;
  ctx.effect(
    () =>
      locale.register(NS, {
        zh: {
          title: "视频工作台",
          tab: "视频",
          close: "关闭",
          start: "直接开始剪辑",
          collapse: "收起剪辑区",
          understood: "知道了",
          blankGuide: "在当前工作区剪辑视频，无需先发送消息或配置模型。",
          inlineGuide: "素材与工程在本地保存，下方 DSH 输入框可随时协助创作。",
          tabGuide:
            "在当前会话顶部选择「视频」标签，即可剪辑。工作区、会话与下方输入框始终保留。",
          workspaceGuide:
            "选择一个 DSH 工作区开始剪辑。已有会话可直接使用顶部的「视频」标签。",
          noWorkspaces:
            "先用 DSH 中央的工作区选择器添加一个本地文件夹，再点击「直接开始剪辑」。",
          loadingWorkspaces: "正在读取 DSH 工作区…",
          connecting: "正在连接…",
          connectError: "工作区连接失败，请重试或使用 DSH 工作区选择器。",
          sessionWorkspace: "当前会话",
          connected: "已连接 DSH · 可将创作需求加入草稿",
          loadingEditor: "正在载入剪辑工作台…",
          draftReady: "已加入下方 DSH 草稿，检查后即可发送",
          draftInvalid: "创作草稿格式不正确，请重试。",
          draftSessionChanged: "当前会话已切换，请返回工程所属会话后重试。",
          draftBusy: "DSH 正在处理输入，请稍后再加入草稿。",
          draftUnavailable: "当前会话草稿暂不可用，请重试。",
        },
        en: {
          title: "Video Studio",
          tab: "Video",
          close: "Close",
          start: "Start editing",
          collapse: "Collapse editor",
          understood: "Got it",
          blankGuide:
            "Edit in this workspace without sending a message or configuring a model.",
          inlineGuide:
            "Media and projects stay local. Use the DSH composer below for creative assistance.",
          tabGuide:
            "Choose the Video tab above this conversation. Your workspace, conversation, and composer stay available.",
          workspaceGuide:
            "Choose a DSH workspace to start editing. Existing conversations have a Video tab.",
          noWorkspaces:
            "Add a local folder with DSH's workspace picker, then choose Start editing.",
          loadingWorkspaces: "Loading DSH workspaces…",
          connecting: "Connecting…",
          connectError:
            "Could not connect. Retry or use DSH's workspace picker.",
          sessionWorkspace: "Current conversation",
          connected: "Connected to DSH · Add creative requests to your draft",
          loadingEditor: "Loading Video Studio…",
          draftReady:
            "Added to your DSH draft below. Review it before sending.",
          draftInvalid: "The creative draft is invalid. Please retry.",
          draftSessionChanged:
            "The current conversation changed. Return to this project's conversation and retry.",
          draftBusy:
            "DSH is processing input. Try adding your draft again shortly.",
          draftUnavailable:
            "This conversation's draft is temporarily unavailable. Please retry.",
        },
      }),
    "video-studio: native dictionaries",
  );
  const t = locale.bind(NS);
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.dshVideoStudio = "";
    style.textContent = shellStyles;
    document.head.append(style);
    return () => style.remove();
  }, "video-studio: owned native styles");
  const studio = createSnapshotStore<StudioShellState>({
    guideOpen: false,
    expanded: {},
  });
  let disposed = false;
  ctx.effect(
    () => () => {
      disposed = true;
    },
    "video-studio: pending navigation lifetime",
  );
  const closeGuide = (): void =>
    studio.update((s) => {
      s.guideOpen = false;
    });
  const expand = (id: string, open: boolean): void =>
    studio.update((s) => {
      s.expanded[id] = open;
    });
  const shellProps = () => ({
    hooks: { studio },
    closeGuide,
    expand,
    toggleGuide: (): void =>
      studio.update((s) => {
        s.guideOpen = !s.guideOpen;
      }),
    connectWorkspace: async (id: string): Promise<void> => {
      const previous = sessions.list.getSnapshot().current;
      const sessionId = await workspaceNavigation.connectWorkspace(id);
      if (disposed) return;
      if (sessions.list.getSnapshot().current !== previous) return;
      expand(sessionId, true);
      sessions.open(sessionId);
      closeGuide();
    },
  });
  const viewProps = (sessionId: string) => ({
    isCurrentSession: (): boolean =>
      sessions.list.getSnapshot().current === sessionId,
    readInput: (): InputSnapshot => {
      const scope = sessions.scope(sessionId);
      if (!scope) throw new Error("video-studio: session unavailable");
      return conversation.input.for(scope).state.getSnapshot();
    },
  });
  slots.inject("sidebar.footer.action", () =>
    slots.register(
      {
        name: "sidebar.footer.action",
        id: "video-studio",
        order: 10,
        locale: NS,
        inject: shellProps,
      },
      Entry,
    ),
  );
  slots.inject("shell.overlay", () =>
    slots.register(
      {
        name: "shell.overlay",
        id: "video-studio-guide",
        order: 70,
        locale: NS,
        inject: shellProps,
      },
      Guide,
    ),
  );
  slots.inject("conversation.view", () =>
    slots.register(
      {
        name: "conversation.view",
        id: "video-studio",
        order: 30,
        locale: NS,
        label: () => t("tab"),
        inject: viewProps,
      },
      VideoView,
    ),
  );
  slots.inject("conversation.input.dock", () =>
    slots.register(
      {
        name: "conversation.input.dock",
        id: "video-studio-blank",
        order: 30,
        locale: NS,
        inject: (id: string) => ({
          ...viewProps(id),
          hooks: { studio },
          expand,
        }),
      },
      BlankDock,
    ),
  );
}
