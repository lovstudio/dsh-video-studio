window.__ModuleLoader__.load({
  id: "@lovstudio/dsh-video-studio",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    ("use strict");
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if ((from && typeof from === "object") || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    var __toCommonJS = (mod) =>
      __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export(index_exports, {
      apply: () => apply,
      inject: () => inject,
    });
    module.exports = __toCommonJS(index_exports);
    var import_react = require("react");
    var import_dsh_client_store = require("@deepseek-ai/dsh-client-store");
    function appendStudioDraft(draft, text) {
      const incoming = text.trim();
      if (!incoming) throw new Error("empty-draft");
      if (draft === incoming || draft.endsWith("\n\n---\n\n".concat(incoming)))
        return draft;
      return draft.trim()
        ? "".concat(draft, "\n\n---\n\n").concat(incoming)
        : incoming;
    }
    function isBlankConversation(session, activeTargets) {
      return (
        session.blank &&
        !session.running &&
        !session.promptAttempted &&
        activeTargets.size === 0
      );
    }
    var shellStyles =
      "\n.dsh-vs-entry { display:flex; align-items:center; justify-content:center; gap:9px; width:36px; height:36px; border:0; border-radius:10px; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; cursor:pointer }\n.dsh-vs-entry[data-wide] { justify-content:flex-start; width:100%; height:42px; padding:0 9px }\n.dsh-vs-entry:hover, .dsh-vs-button:hover { background:var(--dsw-alias-interactive-bg-hover) }\n.dsh-vs-entry:focus-visible, .dsh-vs-button:focus-visible, .dsh-vs-workspace:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px }\n.dsh-vs-guide { position:fixed; bottom:76px; left:16px; z-index:80; width:min(340px,calc(100vw - 32px)); box-sizing:border-box; padding:18px; border:1px solid var(--dsw-alias-border-l3); border-radius:16px; background:var(--dsw-alias-bg-overlay); color:var(--dsw-alias-label-primary); box-shadow:0 12px 44px #0002; font:13px/1.55 system-ui }\n.dsh-vs-row { display:flex; align-items:center; justify-content:space-between; gap:12px; min-width:0 }\n.dsh-vs-heading { display:flex; align-items:center; gap:9px; font-weight:600 }\n.dsh-vs-copy { margin:10px 0 14px; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:1.65 }\n.dsh-vs-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:7px 11px; border:1px solid var(--dsw-alias-border-l3); border-radius:9px; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; white-space:nowrap }\n.dsh-vs-button:disabled { opacity:.5; cursor:wait }\n.dsh-vs-button[data-kind='quiet'] { border-color:transparent; background:transparent; padding:4px 7px }\n.dsh-vs-workspaces { display:flex; flex-direction:column; gap:5px; max-height:240px; overflow:auto }\n.dsh-vs-workspace { display:flex; flex-direction:column; gap:3px; padding:10px; text-align:left; border:1px solid var(--dsw-alias-border-l3); border-radius:9px; background:var(--dsw-alias-bg-layer-1); color:inherit; font:inherit; cursor:pointer }\n.dsh-vs-workspace small { color:var(--dsw-alias-label-tertiary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap }\n.dsh-vs-workspace:hover { background:var(--dsw-alias-interactive-bg-hover) }\n.dsh-vs-dock { box-sizing:border-box; flex:none; min-height:max-content; width:calc(100% - 2 * var(--dsh-composer-side-clearance,16px) - 4 * var(--dsh-composer-dock-inset,8px)); max-width:calc(var(--dsh-composer-card-max-width,920px) - 4 * var(--dsh-composer-dock-inset,8px)); margin:0 auto; border:1px solid var(--dsw-alias-border-l3); border-radius:14px; overflow:hidden; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); font:13px/1.5 system-ui }\n/* Hero centering must not put an oversized inline editor above the scroll origin. */\n[data-slot='conversation'] [data-conversation-scroll]:has(.dsh-vs-dock) { justify-content:safe center }\n[data-slot='conversation'] [data-conversation-scroll]:has(.dsh-vs-dock[data-expanded]) { justify-content:flex-start }\n/* Only our expanded blank-session dock widens its native composer stack. */\n[data-composer-seat] div:has(> [data-slot='conversation.input.dock'] > .dsh-vs-dock[data-expanded]) { flex:none; width:100%; align-self:stretch; padding-top:16px }\n.dsh-vs-dock[data-expanded] { width:calc(100% - 2 * var(--dsh-composer-side-clearance,16px)); max-width:none }\n.dsh-vs-dock[data-expanded] .dsh-vs-frame-wrap { height:clamp(440px,68dvh,760px); flex:none }\n.dsh-vs-dock-intro { padding:14px 16px }\n.dsh-vs-dock-intro .dsh-vs-copy { margin:5px 0 0 }\n.dsh-vs-native { display:flex; flex:1; flex-direction:column; min-height:0; min-width:0; height:var(--dsh-conversation-viewport-height,72vh); box-sizing:border-box; padding-bottom:var(--dsh-composer-height,180px); background:var(--dsw-alias-bg-base) }\n.dsh-vs-frame-wrap { display:flex; flex:1; flex-direction:column; min-height:0; min-width:0; position:relative; overflow:hidden }\n.dsh-vs-context { display:flex; flex:none; align-items:center; flex-wrap:wrap; justify-content:space-between; gap:8px; padding:8px 14px; border-bottom:1px solid var(--dsw-alias-border-l3); background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-secondary); font:11px/1.5 system-ui }\n.dsh-vs-context-name { display:flex; align-items:center; gap:7px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }\n.dsh-vs-context-name span { overflow:hidden; text-overflow:ellipsis }\n.dsh-vs-status { color:var(--dsw-alias-label-tertiary); font-size:11px }\n.dsh-vs-frame { display:block; flex:1; width:100%; min-height:0; border:0; background:var(--dsw-alias-bg-base) }\n.dsh-vs-loading { position:absolute; inset:34px 0 0; display:grid; place-items:center; pointer-events:none; color:var(--dsw-alias-label-tertiary); background:var(--dsw-alias-bg-base); font:12px system-ui }\n.dsh-vs-error { margin:9px 0 0; color:var(--dsw-alias-label-primary); font-size:12px; line-height:1.5 }\n@media(max-width:640px) { .dsh-vs-dock-intro .dsh-vs-row { align-items:flex-start; flex-direction:column } .dsh-vs-context { padding:6px 10px } }\n";
    var import_jsx_runtime = require("react/jsx-runtime");
    var CHANNEL = "dsh-video-studio";
    var NS = "videoStudio";
    var inject = [
      "slots",
      "locale",
      "sessions",
      "uiSession",
      "uiWorkspace",
      "conversation",
    ];
    function StudioIcon({ size = 18 }) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
            x: "3",
            y: "5",
            width: "18",
            height: "15",
            rx: "3",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
            d: "M3 10h18M8 5l3 5m3-5 3 5M10 13l5 2.5-5 2.5z",
          }),
        ],
      });
    }
    function Entry({ wide, toggleGuide, useStudio, t }) {
      const open = useStudio((s) => s.guideOpen);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
        type: "button",
        className: "dsh-vs-entry",
        "data-wide": wide || void 0,
        "aria-label": t("title"),
        title: wide ? void 0 : t("title"),
        "aria-expanded": open,
        "aria-controls": "dsh-vs-guide",
        onClick: toggleGuide,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioIcon, {}),
          wide &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              children: t("title"),
            }),
        ],
      });
    }
    function Guide({
      useStudio,
      useSessions,
      useWorkspaces,
      closeGuide,
      expand,
      connectWorkspace,
      t,
    }) {
      const open = useStudio((s) => s.guideOpen);
      const current = useSessions((s) =>
        s.current === void 0 ? void 0 : s.byId[s.current],
      );
      const workspaces = useWorkspaces((s) => s.items);
      const ready = useWorkspaces((s) => s.phase === "ready");
      const [pending, setPending] = (0, import_react.useState)();
      const [error, setError] = (0, import_react.useState)();
      const panel = (0, import_react.useRef)(null);
      const alive = (0, import_react.useRef)(true);
      (0, import_react.useEffect)(() => {
        alive.current = true;
        return () => {
          alive.current = false;
        };
      }, []);
      (0, import_react.useEffect)(() => {
        if (!open) return;
        setError(void 0);
        const escape = (event) => {
          if (event.key === "Escape") closeGuide();
        };
        const outside = (event) => {
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
      const connect = async (id) => {
        if (pending) return;
        setPending(id);
        setError(void 0);
        try {
          await connectWorkspace(id);
        } catch {
          if (alive.current) setError(t("connectError"));
        } finally {
          if (alive.current) setPending(void 0);
        }
      };
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
        id: "dsh-vs-guide",
        className: "dsh-vs-guide",
        ref: panel,
        "aria-label": t("title"),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "dsh-vs-row",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "dsh-vs-heading",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioIcon, {}),
                  t("title"),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                type: "button",
                className: "dsh-vs-button",
                "data-kind": "quiet",
                onClick: closeGuide,
                "aria-label": t("close"),
                children: "\xD7",
              }),
            ],
          }),
          current
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_jsx_runtime.Fragment,
                {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                      className: "dsh-vs-copy",
                      children: current.blank ? t("blankGuide") : t("tabGuide"),
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "dsh-vs-row",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          className: "dsh-vs-status",
                          children: current.displayTitle,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                          type: "button",
                          className: "dsh-vs-button",
                          onClick: () => {
                            if (current.blank) expand(current.id, true);
                            closeGuide();
                          },
                          children: current.blank
                            ? t("start")
                            : t("understood"),
                        }),
                      ],
                    }),
                  ],
                },
              )
            : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_jsx_runtime.Fragment,
                {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                      className: "dsh-vs-copy",
                      children: t("workspaceGuide"),
                    }),
                    workspaces.length > 0
                      ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "dsh-vs-workspaces",
                          children: workspaces.map((workspace) =>
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "button",
                              {
                                type: "button",
                                className: "dsh-vs-workspace",
                                disabled: pending !== void 0,
                                onClick: () => {
                                  void connect(workspace.workspaceId);
                                },
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "span",
                                    {
                                      children:
                                        pending === workspace.workspaceId
                                          ? t("connecting")
                                          : workspace.title,
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "small",
                                    {
                                      title: workspace.path,
                                      children: workspace.path,
                                    },
                                  ),
                                ],
                              },
                              workspace.workspaceId,
                            ),
                          ),
                        })
                      : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "dsh-vs-status",
                          children: ready
                            ? t("noWorkspaces")
                            : t("loadingWorkspaces"),
                        }),
                  ],
                },
              ),
          error &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
              className: "dsh-vs-error",
              role: "alert",
              children: error,
            }),
        ],
      });
    }
    function StudioFrame(props) {
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
      const context = (0, import_react.useMemo)(
        () => ({
          sessionId,
          ...(workspace?.path ? { workspacePath: workspace.path } : {}),
          ...(workspace?.title ? { workspaceName: workspace.title } : {}),
          ...(sessionTitle ? { sessionTitle } : {}),
        }),
        [sessionId, workspace?.path, workspace?.title, sessionTitle],
      );
      const frame = (0, import_react.useRef)(null);
      const [ready, setReady] = (0, import_react.useState)(false);
      const [status, setStatus] = (0, import_react.useState)();
      const latest = (0, import_react.useRef)({
        context,
        inputActions,
        readInput,
        isCurrentSession,
        t,
      });
      latest.current = {
        context,
        inputActions,
        readInput,
        isCurrentSession,
        t,
      };
      const send = (message) =>
        frame.current?.contentWindow?.postMessage(
          { channel: CHANNEL, ...message },
          location.origin,
        );
      (0, import_react.useEffect)(() => {
        const target = frame.current?.contentWindow;
        const post = (message) =>
          target?.postMessage(
            { channel: CHANNEL, ...message },
            location.origin,
          );
        const activity = () =>
          post({ type: document.hidden ? "pause" : "resume" });
        const receive = (event) => {
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
          let error;
          try {
            if (
              typeof data.text !== "string" ||
              !data.text.trim() ||
              data.text.length > 1e5 ||
              typeof data.projectId !== "string" ||
              !/^[A-Za-z0-9_-]{1,160}$/.test(data.projectId)
            )
              error = latest.current.t("draftInvalid");
            else if (!latest.current.isCurrentSession())
              error = latest.current.t("draftSessionChanged");
            else {
              const input = latest.current.readInput();
              if (input.phase !== "plain")
                error = latest.current.t("draftBusy");
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
            ok: error === void 0,
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
      (0, import_react.useEffect)(() => {
        send({ type: "context", context });
      }, [context]);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "dsh-vs-frame-wrap",
        "data-inline": inline || void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "dsh-vs-context",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                className: "dsh-vs-context-name",
                title: workspace?.path,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioIcon, {
                    size: 14,
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                    children: workspace?.title || t("sessionWorkspace"),
                  }),
                  sessionTitle &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                      children: ["\xB7 ", sessionTitle],
                    }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "dsh-vs-status",
                role: "status",
                children: status || t("connected"),
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
            ref: frame,
            className: "dsh-vs-frame",
            title: t("title"),
            src: "/video-studio/?embedded=1&sessionId=".concat(
              encodeURIComponent(sessionId),
            ),
            allow: "autoplay; fullscreen",
            onLoad: () => {
              send({ type: "context", context: latest.current.context });
              send({ type: document.hidden ? "pause" : "resume" });
            },
          }),
          !ready &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              className: "dsh-vs-loading",
              role: "status",
              children: t("loadingEditor"),
            }),
        ],
      });
    }
    function VideoView(props) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "dsh-vs-native",
        "data-conversation-composer-overlay": "",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioFrame, {
          ...props,
        }),
      });
    }
    function BlankDock(props) {
      const { sessionId, useSession, useConversation, useStudio, expand, t } =
        props;
      const session = useSession((s) => s);
      const targets = useConversation((s) => s.activeTargets);
      const expanded = useStudio((s) => s.expanded[sessionId] === true);
      if (!isBlankConversation(session, targets)) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        className: "dsh-vs-dock",
        "data-expanded": expanded || void 0,
        "aria-label": t("title"),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "dsh-vs-dock-intro",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "dsh-vs-row",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "dsh-vs-heading",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          StudioIcon,
                          {},
                        ),
                        t("title"),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                      className: "dsh-vs-copy",
                      children: expanded ? t("inlineGuide") : t("blankGuide"),
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                  type: "button",
                  className: "dsh-vs-button",
                  onClick: () => expand(sessionId, !expanded),
                  children: expanded ? t("collapse") : t("start"),
                }),
              ],
            }),
          }),
          expanded &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              StudioFrame,
              { ...props, inline: true },
              sessionId,
            ),
        ],
      });
    }
    function apply(ctx) {
      const slots = ctx.get("slots");
      const locale = ctx.get("locale");
      const sessions = ctx.get("sessions");
      const workspaceNavigation = ctx.get("uiWorkspace");
      const conversation = ctx.get("conversation");
      ctx.effect(
        () =>
          locale.register(NS, {
            zh: {
              title: "\u89C6\u9891\u5DE5\u4F5C\u53F0",
              tab: "\u89C6\u9891",
              close: "\u5173\u95ED",
              start: "\u76F4\u63A5\u5F00\u59CB\u526A\u8F91",
              collapse: "\u6536\u8D77\u526A\u8F91\u533A",
              understood: "\u77E5\u9053\u4E86",
              blankGuide:
                "\u5728\u5F53\u524D\u5DE5\u4F5C\u533A\u526A\u8F91\u89C6\u9891\uFF0C\u65E0\u9700\u5148\u53D1\u9001\u6D88\u606F\u6216\u914D\u7F6E\u6A21\u578B\u3002",
              inlineGuide:
                "\u7D20\u6750\u4E0E\u5DE5\u7A0B\u5728\u672C\u5730\u4FDD\u5B58\uFF0C\u4E0B\u65B9 DSH \u8F93\u5165\u6846\u53EF\u968F\u65F6\u534F\u52A9\u521B\u4F5C\u3002",
              tabGuide:
                "\u5728\u5F53\u524D\u4F1A\u8BDD\u9876\u90E8\u9009\u62E9\u300C\u89C6\u9891\u300D\u6807\u7B7E\uFF0C\u5373\u53EF\u526A\u8F91\u3002\u5DE5\u4F5C\u533A\u3001\u4F1A\u8BDD\u4E0E\u4E0B\u65B9\u8F93\u5165\u6846\u59CB\u7EC8\u4FDD\u7559\u3002",
              workspaceGuide:
                "\u9009\u62E9\u4E00\u4E2A DSH \u5DE5\u4F5C\u533A\u5F00\u59CB\u526A\u8F91\u3002\u5DF2\u6709\u4F1A\u8BDD\u53EF\u76F4\u63A5\u4F7F\u7528\u9876\u90E8\u7684\u300C\u89C6\u9891\u300D\u6807\u7B7E\u3002",
              noWorkspaces:
                "\u5148\u7528 DSH \u4E2D\u592E\u7684\u5DE5\u4F5C\u533A\u9009\u62E9\u5668\u6DFB\u52A0\u4E00\u4E2A\u672C\u5730\u6587\u4EF6\u5939\uFF0C\u518D\u70B9\u51FB\u300C\u76F4\u63A5\u5F00\u59CB\u526A\u8F91\u300D\u3002",
              loadingWorkspaces:
                "\u6B63\u5728\u8BFB\u53D6 DSH \u5DE5\u4F5C\u533A\u2026",
              connecting: "\u6B63\u5728\u8FDE\u63A5\u2026",
              connectError:
                "\u5DE5\u4F5C\u533A\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u6216\u4F7F\u7528 DSH \u5DE5\u4F5C\u533A\u9009\u62E9\u5668\u3002",
              sessionWorkspace: "\u5F53\u524D\u4F1A\u8BDD",
              connected:
                "\u5DF2\u8FDE\u63A5 DSH \xB7 \u53EF\u5C06\u521B\u4F5C\u9700\u6C42\u52A0\u5165\u8349\u7A3F",
              loadingEditor:
                "\u6B63\u5728\u8F7D\u5165\u526A\u8F91\u5DE5\u4F5C\u53F0\u2026",
              draftReady:
                "\u5DF2\u52A0\u5165\u4E0B\u65B9 DSH \u8349\u7A3F\uFF0C\u68C0\u67E5\u540E\u5373\u53EF\u53D1\u9001",
              draftInvalid:
                "\u521B\u4F5C\u8349\u7A3F\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u91CD\u8BD5\u3002",
              draftSessionChanged:
                "\u5F53\u524D\u4F1A\u8BDD\u5DF2\u5207\u6362\uFF0C\u8BF7\u8FD4\u56DE\u5DE5\u7A0B\u6240\u5C5E\u4F1A\u8BDD\u540E\u91CD\u8BD5\u3002",
              draftBusy:
                "DSH \u6B63\u5728\u5904\u7406\u8F93\u5165\uFF0C\u8BF7\u7A0D\u540E\u518D\u52A0\u5165\u8349\u7A3F\u3002",
              draftUnavailable:
                "\u5F53\u524D\u4F1A\u8BDD\u8349\u7A3F\u6682\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u8BD5\u3002",
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
              loadingWorkspaces: "Loading DSH workspaces\u2026",
              connecting: "Connecting\u2026",
              connectError:
                "Could not connect. Retry or use DSH's workspace picker.",
              sessionWorkspace: "Current conversation",
              connected:
                "Connected to DSH \xB7 Add creative requests to your draft",
              loadingEditor: "Loading Video Studio\u2026",
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
      const studio = (0, import_dsh_client_store.createSnapshotStore)({
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
      const closeGuide = () =>
        studio.update((s) => {
          s.guideOpen = false;
        });
      const expand = (id, open) =>
        studio.update((s) => {
          s.expanded[id] = open;
        });
      const shellProps = () => ({
        hooks: { studio },
        closeGuide,
        expand,
        toggleGuide: () =>
          studio.update((s) => {
            s.guideOpen = !s.guideOpen;
          }),
        connectWorkspace: async (id) => {
          const previous = sessions.list.getSnapshot().current;
          const sessionId = await workspaceNavigation.connectWorkspace(id);
          if (disposed) return;
          if (sessions.list.getSnapshot().current !== previous) return;
          expand(sessionId, true);
          sessions.open(sessionId);
          closeGuide();
        },
      });
      const viewProps = (sessionId) => ({
        isCurrentSession: () =>
          sessions.list.getSnapshot().current === sessionId,
        readInput: () => {
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
            inject: (id) => ({
              ...viewProps(id),
              hooks: { studio },
              expand,
            }),
          },
          BlankDock,
        ),
      );
    }
    return module.exports;
  },
});
