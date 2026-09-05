# Video Studio implementation note

The DSH extension is a small authenticated host and sidebar shell. Its heavy editing UI is an isolated same-origin application, because embedding a second React runtime and Remotion directly in the harness module loader would couple the plugin to the harness UI version.

The durable project is a versioned, frame-based JSON document. Preview and export consume that document through the same Remotion composition. GSAP timelines stay paused and seek to the current composition frame; no wall-clock animation is used for exported visuals. Editing commands preserve source-frame offsets, and caption conversion quantizes absolute endpoints so adjacent cues do not accumulate rounding gaps.

Only uploaded, registered media may enter server render snapshots. A render creates a private loopback server with a per-job random path and an allowlist, rather than reusing the user's authentication cookie or accepting arbitrary media URLs. Output is published after successful rendering. ASR credentials remain on the host, and missing timestamp-capable provider configuration is surfaced as unavailable.

This is a standalone third-party package, so harness-monorepo-only scripts, package groups, and version alignment do not apply. Validation is local type checking, focused invariant and service tests, built artifact checks, real browser interaction, and actual Remotion output. The existing user DSH process and profile are preserved during isolated validation.

GitHub installation requires committing the complete `lib/` with each source change. pnpm 10.33.3 and 11.21.0 both skip a git dependency's `prepack` when its `main` file is already present; adding `prepare` would instead require install-time build approval. Keep `prepack` for registry packaging, omit `prepare`, and run `verify:dist` before publishing. CI rebuilds and compares `lib/` to keep the committed distribution synchronized.
