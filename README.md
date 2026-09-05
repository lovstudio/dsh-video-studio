# DSH Video Studio

A local-first editing workbench for DeepSeek Harness. Remotion powers both the interactive player and MP4 export. GSAP animations seek to the composition frame, so seeking and rendering use the same motion state.

[简体中文](README.zh.md)

## Install and start

Requires Node.js 22.12+ and the pnpm installation used by DSH.

```sh
npx @deepseek-ai/dsh plugin --profile web add -w github:lovstudio/dsh-video-studio
npx @deepseek-ai/dsh web
```

If DSH is already running, restart it after installation. Open **Video Studio** from the sidebar. The GitHub repository includes the built host, editor, and Remotion composition; users do not need to build the plugin. The editor is served by the harness itself and inherits its signed-cookie authentication. An isolated iframe keeps the editor's React and Remotion versions separate from the harness UI.

To pin a release, append its tag: `github:lovstudio/dsh-video-studio#v0.1.0`.

![DSH Video Studio editor](tests/expected/editor.png)

## Workspace

The editor combines a media library, a frame-accurate preview, clip properties, and four timeline lanes: video, audio, titles, and captions. Import media, arrange and trim clips, split at the playhead, edit titles and captions, change volume and framing, and undo or redo edits. Portrait and square canvases share the same project model. The initial title sequence is an editable example, with no external media dependency.

Project JSON and managed media stay on the host. Server saves are atomic. JSON backups preserve references to media; they do not embed the source files. Render jobs use an immutable project snapshot and expose progress, cancellation, and a downloadable MP4. SRT import/export works without an ASR account.

## Development

Requires Node.js 22.12+ and pnpm 11. Use the repository's `pnpm-workspace.yaml` build approvals.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:render # actual Chrome render and frame determinism
pnpm dev
```

The local development server serves the built editor at `http://127.0.0.1:4318/video-studio/`. Rebuild after source changes. It binds to loopback and rejects foreign origins.

To test a local checkout in the DSH web profile after building:

```sh
npx @deepseek-ai/dsh plugin --profile web add -w /absolute/path/to/dsh-video-studio
```

Commit the generated `lib/` alongside source changes. `pnpm verify:dist` checks the runtime entries, and CI rebuilds the package to detect stale distribution files. Git installs use these committed files; no `prepare` script is required.

## Service API, configuration, and extension points

All HTTP routes live under `/video-studio/`. The DSH host checks the connection service's `requestRejection()` before serving either API or static files. The browser has no API secrets. Media reads support byte ranges and HEAD for seeking.

| Endpoint                   | Behavior                                              |
| -------------------------- | ----------------------------------------------------- |
| `GET api/capabilities`     | Actual ASR and rendering availability                 |
| `GET api/projects`         | Saved projects                                        |
| `PUT api/projects/:id`     | Validate and atomically save a project                |
| `POST api/assets`          | Stream a media upload into the managed asset store    |
| `GET media/:id`            | Authenticated managed media, including Range requests |
| `POST api/render`          | Queue an immutable project snapshot for MP4 export    |
| `POST api/asr`             | Queue a transcription for an uploaded asset           |
| `GET api/jobs/:id`         | Job state and progress                                |
| `POST api/jobs/:id/cancel` | Cancel queued or running work                         |
| `GET exports/:id.mp4`      | Download a completed render                           |

For asset upload, the body is the binary file; query fields describe `name`, `kind`, `duration`, and optional `width`/`height`. Projects use versioned frame-based data. The host accepts only managed asset references for rendering. Each render receives a temporary loopback media server exposing its snapshot's asset allowlist, without giving Chromium the user's DSH login cookie.

ASR requires explicit server configuration. Choose a provider/model supporting timestamped segments:

```sh
export DSH_VIDEO_ASR_ENDPOINT='https://your-provider.example/v1/audio/transcriptions'
export DSH_VIDEO_ASR_MODEL='your-timestamp-capable-model'
export DSH_VIDEO_ASR_FORMAT='diarized_json' # or verbose_json
# Set DSH_VIDEO_ASR_API_KEY through your existing secret manager.
```

The placeholder endpoint above must be replaced with your provider's documented URL. Starting ASR sends the selected media to that configured provider. Missing configuration is reported in the editor; the application does not manufacture transcripts. Provider registration is disposable, allowing a local recognizer or another hosted backend to implement the same timed-segment contract. Rendering and ASR support abort signals and dispose with the plugin. A custom provider plugin injects `videoStudioAsr`, registers through `ctx.get('videoStudioAsr').register(provider)` inside `ctx.effect`, and selects its ID with `asrProvider`. The provider implements `transcribe({asset, language, signal})` and returns `{start, end, text}[]` in seconds.

The durable store, HTTP controller, provider registry, and background job queue are separate modules. `src/core` owns editing invariants and SRT conversion; `src/remotion` owns shared visual output; `src/editor` owns interaction state; `src/shell` owns only DSH integration. New effects should use the same frame-driven composition, and new providers should implement the existing contract rather than adding browser credentials or a second project format.

## Model Experience

### What the model sees

This package adds a user workbench. It does not automatically register model tools, modify prompts, or inject media into conversations. Project JSON can be inspected and edited by an authorized local agent through normal filesystem access.

### Token effect

No additional tool schema or background transcript is added to the model context.

### KV Cache effect

No prompt mutation or cache invalidation is introduced by opening the editor.

## Known Limitations and Deferred Work

- A single project is limited to 30 minutes and 3,000 clips; media upload is limited to 250 MiB. This version targets desktop editing.
- Browser preview compatibility depends on the imported codec. MP4/H.264 with AAC is the recommended interoperable input. There is no automatic proxy/transcode pipeline yet.
- ASR is segment-based and depends on the configured provider. Long-file chunking, local speech-model installation, and word-level forced alignment are not bundled.
- Project backups reference host media and are not portable media archives. Moving hosts requires copying both projects and the asset store.
- The canvas is a compositing timeline with fixed lane types. Advanced ripple editing, keyframe curves, multicam editing, collaboration, and Screen Studio source-project import remain future work.
- Remotion and GSAP retain their own licenses. Review [Remotion licensing](https://www.remotion.dev/docs/license) and [GSAP licensing](https://gsap.com/community/standard-license/) for your distribution and business use.

Official integration references: [Remotion Player](https://www.remotion.dev/docs/player), [Remotion renderMedia](https://www.remotion.dev/docs/renderer/render-media), [GSAP timeline seeking](<https://gsap.com/docs/v3/GSAP/Timeline/seek()/>), and [timestamped speech transcription](https://developers.openai.com/api/docs/guides/speech-to-text).
