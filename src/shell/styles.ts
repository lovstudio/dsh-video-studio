/** Native dock geometry uses the public slot anchors, never hashed host classes. */
export const shellStyles = `
.dsh-vs-entry { display:flex; align-items:center; justify-content:center; gap:9px; width:36px; height:36px; border:0; border-radius:10px; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; cursor:pointer }
.dsh-vs-entry[data-wide] { justify-content:flex-start; width:100%; height:42px; padding:0 9px }
.dsh-vs-entry:hover, .dsh-vs-button:hover { background:var(--dsw-alias-interactive-bg-hover) }
.dsh-vs-entry:focus-visible, .dsh-vs-button:focus-visible, .dsh-vs-workspace:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px }
.dsh-vs-guide { position:fixed; bottom:76px; left:16px; z-index:80; width:min(340px,calc(100vw - 32px)); box-sizing:border-box; padding:18px; border:1px solid var(--dsw-alias-border-l3); border-radius:16px; background:var(--dsw-alias-bg-overlay); color:var(--dsw-alias-label-primary); box-shadow:0 12px 44px #0002; font:13px/1.55 system-ui }
.dsh-vs-row { display:flex; align-items:center; justify-content:space-between; gap:12px; min-width:0 }
.dsh-vs-heading { display:flex; align-items:center; gap:9px; font-weight:600 }
.dsh-vs-copy { margin:10px 0 14px; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:1.65 }
.dsh-vs-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:7px 11px; border:1px solid var(--dsw-alias-border-l3); border-radius:9px; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; white-space:nowrap }
.dsh-vs-button:disabled { opacity:.5; cursor:wait }
.dsh-vs-button[data-kind='quiet'] { border-color:transparent; background:transparent; padding:4px 7px }
.dsh-vs-workspaces { display:flex; flex-direction:column; gap:5px; max-height:240px; overflow:auto }
.dsh-vs-workspace { display:flex; flex-direction:column; gap:3px; padding:10px; text-align:left; border:1px solid var(--dsw-alias-border-l3); border-radius:9px; background:var(--dsw-alias-bg-layer-1); color:inherit; font:inherit; cursor:pointer }
.dsh-vs-workspace small { color:var(--dsw-alias-label-tertiary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.dsh-vs-workspace:hover { background:var(--dsw-alias-interactive-bg-hover) }
.dsh-vs-dock { box-sizing:border-box; flex:none; min-height:max-content; width:calc(100% - 2 * var(--dsh-composer-side-clearance,16px) - 4 * var(--dsh-composer-dock-inset,8px)); max-width:calc(var(--dsh-composer-card-max-width,920px) - 4 * var(--dsh-composer-dock-inset,8px)); margin:0 auto; border:1px solid var(--dsw-alias-border-l3); border-radius:14px; overflow:hidden; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); font:13px/1.5 system-ui }
/* Hero centering must not put an oversized inline editor above the scroll origin. */
[data-slot='conversation'] [data-conversation-scroll]:has(.dsh-vs-dock) { justify-content:safe center }
[data-slot='conversation'] [data-conversation-scroll]:has(.dsh-vs-dock[data-expanded]) { justify-content:flex-start }
/* Only our expanded blank-session dock widens its native composer stack. */
[data-composer-seat] div:has(> [data-slot='conversation.input.dock'] > .dsh-vs-dock[data-expanded]) { flex:none; width:100%; align-self:stretch; padding-top:16px }
.dsh-vs-dock[data-expanded] { width:calc(100% - 2 * var(--dsh-composer-side-clearance,16px)); max-width:none }
.dsh-vs-dock[data-expanded] .dsh-vs-frame-wrap { height:clamp(440px,68dvh,760px); flex:none }
.dsh-vs-dock-intro { padding:14px 16px }
.dsh-vs-dock-intro .dsh-vs-copy { margin:5px 0 0 }
.dsh-vs-native { display:flex; flex:1; flex-direction:column; min-height:0; min-width:0; height:var(--dsh-conversation-viewport-height,72vh); box-sizing:border-box; padding-bottom:var(--dsh-composer-height,180px); background:var(--dsw-alias-bg-base) }
.dsh-vs-frame-wrap { display:flex; flex:1; flex-direction:column; min-height:0; min-width:0; position:relative; overflow:hidden }
.dsh-vs-context { display:flex; flex:none; align-items:center; flex-wrap:wrap; justify-content:space-between; gap:8px; padding:8px 14px; border-bottom:1px solid var(--dsw-alias-border-l3); background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-secondary); font:11px/1.5 system-ui }
.dsh-vs-context-name { display:flex; align-items:center; gap:7px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.dsh-vs-context-name span { overflow:hidden; text-overflow:ellipsis }
.dsh-vs-status { color:var(--dsw-alias-label-tertiary); font-size:11px }
.dsh-vs-frame { display:block; flex:1; width:100%; min-height:0; border:0; background:var(--dsw-alias-bg-base) }
.dsh-vs-loading { position:absolute; inset:34px 0 0; display:grid; place-items:center; pointer-events:none; color:var(--dsw-alias-label-tertiary); background:var(--dsw-alias-bg-base); font:12px system-ui }
.dsh-vs-error { margin:9px 0 0; color:var(--dsw-alias-label-primary); font-size:12px; line-height:1.5 }
@media(max-width:640px) { .dsh-vs-dock-intro .dsh-vs-row { align-items:flex-start; flex-direction:column } .dsh-vs-context { padding:6px 10px } }
`;
