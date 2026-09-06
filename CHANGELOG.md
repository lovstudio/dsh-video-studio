# Changelog

## 0.2.1

- Restore each DSH session’s saved project on startup, including after browser recovery storage is cleared.
- Start new sessions with a workspace-bound empty project; create the demo only when explicitly requested.
- Preserve unsaved recovery branches and existing projects while keeping automatic project selection scoped to the current session.

## 0.2.0

- Replace the fullscreen workbench overlay with a native DSH conversation Video tab and an inline editor for blank conversations.
- Associate projects with the real DSH workspace and prepare creative requests in the existing conversation draft.
- Register workspace-scoped project read/update and video render/job tools for DSH Agent.
- Synchronize saved Agent edits into the timeline and protect concurrent GUI/Agent writes with revision checks and recovery controls.

## 0.1.0

- Add a DSH sidebar workbench with an isolated React editor.
- Share Remotion compositions between preview and MP4 export, with frame-driven GSAP animation.
- Support media import, timeline editing, captions, SRT, project recovery, and configurable ASR providers.
- Ship the complete prebuilt plugin in Git for direct `github:lovstudio/dsh-video-studio` installation.
