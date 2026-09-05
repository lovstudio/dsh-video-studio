import { useEffect, useRef, type ReactNode } from "react";
import type { Context } from "@deepseek-ai/cordis";
import { createSnapshotStore } from "@deepseek-ai/dsh-client-store";

interface StudioView {
  open: boolean;
  mounted: boolean;
}
type CopyKey = "title" | "back";
interface ShellProps {
  wide?: boolean;
  open(): void;
  close(): void;
  useStudio<T>(selector: (state: StudioView) => T): T;
  t(key: CopyKey): string;
}
interface Slots {
  inject(name: string, register: () => () => void): unknown;
  register(
    options: {
      name: string;
      id: string;
      order: number;
      locale: string;
      inject(): {
        open(): void;
        close(): void;
        hooks: { studio: ReturnType<typeof createSnapshotStore<StudioView>> };
      };
    },
    component: (props: ShellProps) => ReactNode,
  ): () => void;
}
interface Locale {
  register(
    namespace: string,
    dictionaries: Record<string, Record<CopyKey, string>>,
  ): () => void;
}

export const inject = ["slots", "locale"];

function Entry({ wide, open, t }: ShellProps): ReactNode {
  return (
    <button
      type="button"
      aria-label={t("title")}
      title={wide ? undefined : t("title")}
      onClick={open}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: wide ? "flex-start" : "center",
        gap: 9,
        width: wide ? "100%" : 36,
        height: wide ? 42 : 36,
        padding: wide ? "0 9px" : 0,
        border: 0,
        borderRadius: 10,
        background: "transparent",
        color: "var(--dsw-alias-label-primary)",
        font: "inherit",
        cursor: "pointer",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M3 10h18M8 5l3 5m3-5 3 5M10 13l5 2.5-5 2.5z" />
      </svg>
      {wide ? <span>{t("title")}</span> : null}
    </button>
  );
}

function Overlay({ useStudio, close, t }: ShellProps): ReactNode {
  const open = useStudio((state) => state.open);
  const mounted = useStudio((state) => state.mounted);
  const frame = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const priorFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    const onMessage = (event: MessageEvent): void => {
      if (
        event.origin === location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.channel === "dsh-video-studio" &&
        event.data?.type === "close"
      )
        close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
      priorFocus?.focus();
    };
  }, [open, close]);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { channel: "dsh-video-studio", type: open ? "resume" : "pause" },
      location.origin,
    );
  }, [open]);
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open)
      dialog.current.showModal();
    else if (!open) dialog.current?.close();
  }, [open]);
  if (!mounted) return null;
  return (
    <dialog
      ref={dialog}
      aria-modal="true"
      aria-label={t("title")}
      aria-hidden={!open}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        width: "100vw",
        height: "100dvh",
        maxWidth: "none",
        maxHeight: "none",
        margin: 0,
        padding: 0,
        border: 0,
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#f4f1eb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: "none",
          height: 34,
          padding: "0 18px",
          borderBottom: "1px solid rgba(0,0,0,.08)",
          background: "#eeeae3",
          color: "#5f635e",
          font: "12px system-ui",
        }}
      >
        <span>DeepSeek Harness · Video Studio</span>
        <button
          ref={closeButton}
          type="button"
          onClick={close}
          aria-label={t("back")}
          style={{
            border: 0,
            background: "transparent",
            color: "inherit",
            padding: "5px 8px",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {t("back")} ×
        </button>
      </div>
      <iframe
        ref={frame}
        title={t("title")}
        src="/video-studio/"
        style={{ border: 0, width: "100%", flex: 1, minHeight: 0 }}
        allow="autoplay; fullscreen"
      />
    </dialog>
  );
}

/** The lightweight DSH shell keeps the isolated editor mounted between visits. */
export function apply(ctx: Context): void {
  const slots = ctx.get("slots") as Slots;
  const locale = ctx.get("locale") as Locale;
  ctx.effect(
    () =>
      locale.register("videoStudio", {
        zh: { title: "视频工作台", back: "返回 DSH" },
        en: { title: "Video Studio", back: "Back to DSH" },
      }),
    "video-studio: shell dictionaries",
  );
  const studio = createSnapshotStore<StudioView>({
    open: false,
    mounted: false,
  });
  const open = (): void =>
    studio.update((state) => {
      state.open = true;
      state.mounted = true;
    });
  const close = (): void =>
    studio.update((state) => {
      state.open = false;
    });
  const injectProps = () => ({ open, close, hooks: { studio } });
  slots.inject("sidebar.footer.action", () =>
    slots.register(
      {
        name: "sidebar.footer.action",
        id: "video-studio",
        order: 10,
        locale: "videoStudio",
        inject: injectProps,
      },
      Entry,
    ),
  );
  slots.inject("shell.overlay", () =>
    slots.register(
      {
        name: "shell.overlay",
        id: "video-studio",
        order: 100,
        locale: "videoStudio",
        inject: injectProps,
      },
      Overlay,
    ),
  );
}
