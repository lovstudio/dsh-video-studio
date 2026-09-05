import { useEffect, useRef, useState } from "react";

export const embedded =
  new URLSearchParams(location.search).get("embedded") === "1" &&
  window.parent !== window;
if (embedded) document.documentElement.dataset.dshEmbedded = "true";
export interface DshContext {
  sessionId: string;
  workspacePath: string;
  workspaceName?: string;
  sessionTitle?: string;
}
export function useDsh() {
  const [context, setContext] = useState<DshContext>();
  const [draftState, setDraftState] = useState<
    "idle" | "pending" | "ready" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!embedded) return;
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        event.data?.channel !== "dsh-video-studio"
      )
        return;
      if (event.data.type === "context") {
        const value = event.data.context;
        if (
          typeof value?.sessionId === "string" &&
          typeof value?.workspacePath === "string" &&
          value.workspacePath
        )
          setContext(value);
      }
      if (event.data.type === "draft-result") {
        clearTimeout(timeout.current);
        setDraftState(event.data.ok ? "ready" : "error");
        setMessage(
          event.data.ok
            ? "工程已加入下方 DSH 输入框，可补充要求后发送。"
            : event.data.message || "无法写入 DSH 草稿，请稍后重试。",
        );
      }
    };
    window.addEventListener("message", receive);
    parent.postMessage(
      { channel: "dsh-video-studio", type: "ready" },
      location.origin,
    );
    return () => {
      window.removeEventListener("message", receive);
      clearTimeout(timeout.current);
    };
  }, []);
  const draft = (text: string, projectId: string) => {
    if (!context || !embedded)
      throw new Error("请从 DSH 会话中打开视频工作台。");
    setDraftState("pending");
    setMessage("");
    parent.postMessage(
      { channel: "dsh-video-studio", type: "draft", text, projectId },
      location.origin,
    );
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setDraftState("error");
      setMessage("DSH 会话未响应，请重新打开视频标签页。");
    }, 10000);
  };
  return { embedded, context, draft, draftState, message };
}
