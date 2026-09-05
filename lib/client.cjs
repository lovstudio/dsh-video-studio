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
    var import_jsx_runtime = require("react/jsx-runtime");
    var inject = ["slots", "locale"];
    function Entry({ wide, open, t }) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
        type: "button",
        "aria-label": t("title"),
        title: wide ? void 0 : t("title"),
        onClick: open,
        style: {
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
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
            width: "18",
            height: "18",
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
          }),
          wide
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                children: t("title"),
              })
            : null,
        ],
      });
    }
    function Overlay({ useStudio, close, t }) {
      const open = useStudio((state) => state.open);
      const mounted = useStudio((state) => state.mounted);
      const frame = (0, import_react.useRef)(null);
      const dialog = (0, import_react.useRef)(null);
      const closeButton = (0, import_react.useRef)(null);
      (0, import_react.useEffect)(() => {
        if (!open) return;
        const priorFocus =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : void 0;
        closeButton.current?.focus();
        const onKey = (event) => {
          if (event.key === "Escape") close();
        };
        const onMessage = (event) => {
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
      (0, import_react.useEffect)(() => {
        frame.current?.contentWindow?.postMessage(
          { channel: "dsh-video-studio", type: open ? "resume" : "pause" },
          location.origin,
        );
      }, [open]);
      (0, import_react.useEffect)(() => {
        if (open && dialog.current && !dialog.current.open)
          dialog.current.showModal();
        else if (!open) dialog.current?.close();
      }, [open]);
      if (!mounted) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
        ref: dialog,
        "aria-modal": "true",
        "aria-label": t("title"),
        "aria-hidden": !open,
        onCancel: (event) => {
          event.preventDefault();
          close();
        },
        style: {
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
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            style: {
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
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                children: "DeepSeek Harness \xB7 Video Studio",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
                ref: closeButton,
                type: "button",
                onClick: close,
                "aria-label": t("back"),
                style: {
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  padding: "5px 8px",
                  cursor: "pointer",
                  font: "inherit",
                },
                children: [t("back"), " \xD7"],
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
            ref: frame,
            title: t("title"),
            src: "/video-studio/",
            style: { border: 0, width: "100%", flex: 1, minHeight: 0 },
            allow: "autoplay; fullscreen",
          }),
        ],
      });
    }
    function apply(ctx) {
      const slots = ctx.get("slots");
      const locale = ctx.get("locale");
      ctx.effect(
        () =>
          locale.register("videoStudio", {
            zh: {
              title: "\u89C6\u9891\u5DE5\u4F5C\u53F0",
              back: "\u8FD4\u56DE DSH",
            },
            en: { title: "Video Studio", back: "Back to DSH" },
          }),
        "video-studio: shell dictionaries",
      );
      const studio = (0, import_dsh_client_store.createSnapshotStore)({
        open: false,
        mounted: false,
      });
      const open = () =>
        studio.update((state) => {
          state.open = true;
          state.mounted = true;
        });
      const close = () =>
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
    return module.exports;
  },
});
