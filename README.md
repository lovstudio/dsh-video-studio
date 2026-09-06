# DSH Video Studio

A video editing view inside DeepSeek Harness conversations. Keep the DSH workspace, conversation, and composer alongside the timeline. Remotion powers preview and MP4 export; GSAP animations seek to the same composition frame.

[简体中文](README.zh.md)

## Install and start

Requires Node.js 22.12+ and the pnpm installation used by DSH.

```sh
npx @deepseek-ai/dsh plugin --profile web add -w github:lovstudio/dsh-video-studio
npx @deepseek-ai/dsh web
```

If DSH is already running, restart it after installation. Select a workspace and open the **Video** tab in an existing conversation. A blank conversation offers **Start editing** above the composer, without requiring a model key or sending a message. The GitHub repository includes all runtime builds; no manual build is required.

To pin a release, append its tag: `github:lovstudio/dsh-video-studio#v0.2.2`.

![DSH Video Studio editor](tests/expected/editor.png)

The screenshot illustrates editing a demo. New sessions start with an empty timeline; demos must be opened explicitly.

## Workspace

The editor combines a media library, a frame-accurate preview, clip properties, and four timeline lanes: video, audio, titles, and captions. Import media, arrange and trim clips, split at the playhead, edit titles and captions, change volume and framing, and undo or redo edits. Portrait and square canvases share the same project model. The editor restores the current session's saved project first. New sessions start with an empty timeline; the title demo can be created explicitly with Open demo. Existing projects and demos are preserved.

Unchanged demos created automatically by older versions are retained for manual opening and no longer replace a session's actual project. Modified drafts are preserved. Automatic recovery is scoped to the current session and workspace; an explicit selection can reopen another project in the same workspace.

**Browse workspace media** lists folders and supported media from the current session's actual DSH workspace. Select a video, audio file, or image to copy it into this project's media library, then add it to the timeline. Source files remain unchanged. The host resolves the workspace through DSH session metadata, rejects path escapes, and streams media with Range support. Directory browsing is bounded and skips hidden folders, dependencies, and build caches. Remotion projects are detected from their package manifest; source compositions are not automatically executed or converted into timeline clips.

Project JSON and managed media stay on the host, under `$DSH_HOME/video-studio` (or `~/.dsh/video-studio` when unset), unless `dataDir` or `DSH_VIDEO_DATA_DIR` overrides the location. Server saves are atomic. JSON backups preserve references to media; they do not embed the source files. Render jobs use an immutable project snapshot and expose progress, cancellation, and a downloadable MP4. SRT import/export works without an ASR account.

**Hand off to DSH** saves the current project and adds its ID, selected clip, and playhead to the current conversation's draft. Existing draft text is preserved; you review and send it. DSH Agent can read and edit the same project using the registered tools. Saved Agent changes refresh the timeline, and concurrent edits produce a version conflict with local backup and reload actions.

Projects created inside DSH belong to that workspace. Existing unbound projects are associated when you choose Hand off to DSH. Tool access uses the executing session's actual workspace path; tools cannot claim an unbound project or read another workspace's project. The iframe only isolates the Remotion/React runtime, while DSH owns navigation, conversation state, input, tools, and authentication.

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

The standalone development server at `http://127.0.0.1:4318/video-studio/` is for editor debugging. It does not provide the DSH conversation or Agent integration. Validate the plugin through `dsh web`. Rebuild after source changes. The development server binds to loopback and rejects foreign origins.

To test a local checkout in the DSH web profile after building:

```sh
npx @deepseek-ai/dsh plugin --profile web add -w /absolute/path/to/dsh-video-studio
```

Commit the generated `lib/` alongside source changes. `pnpm verify:dist` checks the runtime entries, and CI rebuilds the package to detect stale distribution files. Git installs use these committed files; no `prepare` script is required.

## Service API, configuration, and extension points

All HTTP routes live under `/video-studio/`. The DSH host checks the connection service's `requestRejection()` before serving either API or static files. The browser has no API secrets. Media reads support byte ranges and HEAD for seeking.

| Endpoint                                     | Behavior                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `GET api/capabilities`                       | Actual ASR and rendering availability                                          |
| `GET api/projects`                           | Saved projects                                                                 |
| `GET api/projects?sessionId=…&scope=session` | Current session's saved projects; `scope=workspace` supports explicit browsing |
| `GET api/workspace?sessionId=…&path=…`       | Browse a relative directory in the trusted workspace                           |
| `GET workspace/media?sessionId=…&path=…`     | Preview a workspace media file with Range/HEAD support                         |
| `POST api/workspace/import`                  | Import a selected workspace media file into managed storage                    |
| `GET api/projects/:id`                       | Latest saved project and its revision                                          |
| `PUT api/projects/:id`                       | Validate and atomically save a project                                         |
| `POST api/assets`                            | Stream a media upload into the managed asset store                             |
| `GET media/:id`                              | Authenticated managed media, including Range requests                          |
| `POST api/render`                            | Queue an immutable project snapshot for MP4 export                             |
| `POST api/asr`                               | Queue a transcription for an uploaded asset                                    |
| `GET api/jobs/:id`                           | Job state and progress                                                         |
| `POST api/jobs/:id/cancel`                   | Cancel queued or running work                                                  |
| `GET exports/:id.mp4`                        | Download a completed render                                                    |

For asset upload, the body is the binary file; query fields describe `name`, `kind`, `duration`, and optional `width`/`height`. Workspace import accepts JSON with `sessionId`, relative `path`, `duration`, and optional `width`/`height`. Projects use versioned frame-based data. The host accepts only managed asset references for rendering. Each render receives a temporary loopback media server exposing its snapshot's asset allowlist, without giving Chromium the user's DSH login cookie.

ASR requires explicit server configuration. Choose a provider/model supporting timestamped segments:

```sh
export DSH_VIDEO_ASR_ENDPOINT='https://your-provider.example/v1/audio/transcriptions'
export DSH_VIDEO_ASR_MODEL='your-timestamp-capable-model'
export DSH_VIDEO_ASR_FORMAT='diarized_json' # or verbose_json
# Set DSH_VIDEO_ASR_API_KEY through your existing secret manager.
```

The placeholder endpoint above must be replaced with your provider's documented URL. Starting ASR sends the selected media to that configured provider. Missing configuration is reported in the editor; the application does not manufacture transcripts. Provider registration is disposable, allowing a local recognizer or another hosted backend to implement the same timed-segment contract. Rendering and ASR support abort signals and dispose with the plugin. A custom provider plugin injects `videoStudioAsr`, registers through `ctx.get('videoStudioAsr').register(provider)` inside `ctx.effect`, and selects its ID with `asrProvider`. The provider implements `transcribe({asset, language, signal})` and returns `{start, end, text}[]` in seconds.

The durable store, HTTP controller, provider registry, and background job queue are separate modules. `src/core` owns editing invariants and SRT conversion; `src/remotion` owns shared visual output; `src/editor` owns interaction state; `src/shell` owns only DSH integration. New effects should use the same frame-driven composition, and new providers should implement the existing contract rather than adding browser credentials or a second project format.

DSH tools are `video_studio_list`, `video_studio_read`, `video_studio_update`, `video_studio_render`, and `video_studio_job`. Updates require a revision previously read by the same session. The GUI sends `x-studio-revision` (`new` for creation, otherwise the saved `updatedAt`); stale writes return 409. Render tools use the editor's queue and output route, and only the submitting session can inspect or cancel its jobs.

## Model Experience

### What the model sees

The model receives five video tool definitions. Project content is returned when it calls a tool; the Hand off action prepares a user-reviewed draft with project and clip references. Media binaries and ASR credentials are not injected into conversations.

### Token effect

Five stable tool schemas are added. Reading a project consumes context proportional to its clips and metadata. Playback does not stream frames or transcripts into model context.

### KV Cache effect

Tool definitions remain stable during editing and playback. Project state appears in explicit user messages or tool results rather than a continuously changing system prompt.

## Known Limitations and Deferred Work

- A single project is limited to 30 minutes and 3,000 clips; media upload is limited to 250 MiB. This version targets desktop editing.
- Browser preview compatibility depends on the imported codec. MP4/H.264 with AAC is the recommended interoperable input. There is no automatic proxy/transcode pipeline yet.
- ASR is segment-based and depends on the configured provider. Long-file chunking, local speech-model installation, and word-level forced alignment are not bundled.
- Project backups reference host media and are not portable media archives. Moving hosts requires copying both projects and the asset store.
- The canvas is a compositing timeline with fixed lane types. Advanced ripple editing, keyframe curves, multicam editing, collaboration, and Screen Studio source-project import remain future work.
- Remotion and GSAP retain their own licenses. Review [Remotion licensing](https://www.remotion.dev/docs/license) and [GSAP licensing](https://gsap.com/community/standard-license/) for your distribution and business use.

Official integration references: [Remotion Player](https://www.remotion.dev/docs/player), [Remotion renderMedia](https://www.remotion.dev/docs/renderer/render-media), [GSAP timeline seeking](<https://gsap.com/docs/v3/GSAP/Timeline/seek()/>), and [timestamped speech transcription](https://developers.openai.com/api/docs/guides/speech-to-text).
