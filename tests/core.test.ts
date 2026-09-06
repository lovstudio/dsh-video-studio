import assert from "node:assert/strict";
import test from "node:test";
import {
  addAssetClip,
  createClip,
  createProject,
  durationInFrames,
  formatTime,
  isLegacyAutoDemo,
  isPristineExample,
  projectSchema,
  splitClip,
  updateClip,
} from "../src/core/project";
import type { Asset, Clip, Project } from "../src/types";

const video = (overrides: Partial<Asset> = {}): Asset => ({
  id: "source-video",
  name: "Interview.mp4",
  kind: "video",
  src: "/media/source.mp4",
  duration: 10,
  ...overrides,
});
function mediaProject(asset = video(), patch: Partial<Clip> = {}): Project {
  return {
    ...createProject(false),
    assets: [asset],
    clips: [
      createClip({
        id: "interview",
        kind: "media",
        trackId: asset.kind === "audio" ? "audio" : "video",
        assetId: asset.id,
        start: 60,
        sourceStart: 45,
        duration: 120,
        ...patch,
      }),
    ],
  };
}

test("split retains source continuity, the left ID, and the unedited project", () => {
  const original = mediaProject();
  const snapshot = structuredClone(original);
  const result = splitClip(original, "interview", 105);
  assert.deepEqual(
    result.clips.map(({ start, duration, sourceStart }) => ({
      start,
      duration,
      sourceStart,
    })),
    [
      { start: 60, duration: 45, sourceStart: 45 },
      { start: 105, duration: 75, sourceStart: 90 },
    ],
  );
  assert.equal(result.clips[0].id, "interview");
  assert.notEqual(result.clips[1].id, "interview");
  assert.equal(durationInFrames(result), durationInFrames(original));
  assert.deepEqual(original, snapshot);
  assert.doesNotThrow(() => projectSchema.parse(result));
});

test("split quantizes a fractional playhead before creating both pieces", () => {
  const result = splitClip(mediaProject(), "interview", 105.4);
  assert.equal(result.clips[1].start, 105);
  assert.equal(result.clips[0].duration, 45);
  assert.equal(result.clips[1].sourceStart, 90);
  assert.doesNotThrow(() => projectSchema.parse(result));
});

test("split ignores boundaries after rounding, unknown clips, and non-finite positions", () => {
  const project = mediaProject();
  for (const at of [59, 60, 60.1, 179.8, 180, 200, Number.NaN, Infinity])
    assert.equal(splitClip(project, "interview", at), project);
  assert.equal(splitClip(project, "missing", 105), project);
});

test("trim clamps negative and overshooting values to a playable source interval", () => {
  const original = mediaProject();
  const result = updateClip(original, "interview", {
    id: "replaced",
    start: -2.8,
    sourceStart: 299.7,
    duration: 40.6,
  });
  assert.equal(result.clips[0].id, "interview");
  assert.equal(result.clips[0].start, 0);
  assert.equal(result.clips[0].sourceStart, 299);
  assert.equal(result.clips[0].duration, 1);
  assert.equal(original.clips[0].sourceStart, 45);
  assert.doesNotThrow(() => projectSchema.parse(result));
});

test("sub-frame media consistently retains one playable frame on import and trim", () => {
  const imported = addAssetClip(
    createProject(false),
    video({ duration: 0.01 }),
  );
  assert.equal(imported.clips[0].duration, 1);
  const trimmed = updateClip(imported, imported.clips[0].id, {
    sourceStart: 99,
    duration: 99,
  });
  assert.equal(trimmed.clips[0].sourceStart, 0);
  assert.equal(trimmed.clips[0].duration, 1);
  assert.doesNotThrow(() => projectSchema.parse(trimmed));
});

test("source duration quantization is consistent for import, edit, and boundary validation", () => {
  const imported = addAssetClip(
    createProject(false),
    video({ duration: 1.01 }),
  );
  assert.equal(imported.clips[0].duration, 30);
  const edited = updateClip(imported, imported.clips[0].id, { duration: 31 });
  assert.equal(edited.clips[0].duration, 30);
  assert.doesNotThrow(() => projectSchema.parse(edited));
  assert.throws(() =>
    projectSchema.parse({
      ...imported,
      clips: [{ ...imported.clips[0], duration: 31 }],
    }),
  );
});

test("image duration is independent from still-image metadata duration", () => {
  const imported = addAssetClip(
    createProject(false),
    video({ kind: "image", duration: 1 }),
  );
  assert.equal(imported.clips[0].duration, 150);
  const edited = updateClip(imported, imported.clips[0].id, { duration: 900 });
  assert.equal(edited.clips[0].duration, 900);
  assert.doesNotThrow(() => projectSchema.parse(edited));
});

test("asset import appends to its own track and reuses existing asset metadata", () => {
  const original = addAssetClip(createProject(false), video());
  const audio = video({ id: "source-audio", kind: "audio", duration: 2 });
  const second = addAssetClip(original, audio);
  const repeated = addAssetClip(second, video());
  assert.equal(second.clips[1].trackId, "audio");
  assert.equal(second.clips[1].start, 0);
  assert.equal(repeated.clips[2].start, 300);
  assert.equal(repeated.assets.length, 2);
  assert.doesNotThrow(() => projectSchema.parse(repeated));
});

test("projects default to empty; a user-requested example records its origin", () => {
  assert.doesNotThrow(() => projectSchema.parse(createProject()));
  assert.doesNotThrow(() => projectSchema.parse(createProject(false)));
  assert.deepEqual(createProject().clips, []);
  assert.equal(createProject().example, undefined);
  assert.equal(durationInFrames(createProject(false)), 1);
  const example = projectSchema.parse(createProject(true));
  assert.deepEqual(example.example, { template: "opening-v1", source: "user" });
  assert.equal(example.clips.length, 3);
  assert.equal(isPristineExample(example), true);
  assert.equal(isLegacyAutoDemo(example), false);
});

test("legacy example detection ignores only identity, save metadata, and DSH scope", () => {
  const { example: _example, ...legacy } = createProject(true);
  assert.equal(isLegacyAutoDemo(legacy), true);
  const other = {
    ...legacy,
    id: "other-project",
    clips: legacy.clips.map((clip, i) => ({ ...clip, id: `other-clip-${i}` })),
    updatedAt: "2000-01-01T00:00:00.000Z",
    dsh: { workspacePath: "/another-workspace", sessionId: "another-session" },
  };
  assert.equal(isLegacyAutoDemo(other), true);
  assert.equal(isPristineExample(other), true);
});

test("every editable example field protects a user's changed project from legacy migration", () => {
  const { example: _example, ...legacy } = createProject(true);
  const projectChanges: Partial<Project>[] = [
    { name: `${legacy.name} · 我的版本` },
    { fps: 24 },
    { width: 1080 },
    { height: 1920 },
    { assets: [video()] },
    { clips: legacy.clips.slice(1) },
    { clips: [...legacy.clips].reverse() },
  ];
  for (const patch of projectChanges)
    assert.equal(
      isPristineExample({ ...legacy, ...patch }),
      false,
      JSON.stringify(patch),
    );
  const clipChanges: Partial<Clip>[] = [
    { assetId: "linked-asset" },
    { trackId: "captions" },
    { kind: "caption" },
    { name: "重新命名的片段" },
    { start: 1 },
    { duration: 179 },
    { sourceStart: 1 },
    { text: "我修改过的文字" },
    { motion: "none" },
    { volume: 0 },
    { opacity: 0.8 },
    { scale: 1.2 },
    { x: 1 },
    { y: 1 },
    { fontSize: 91 },
    { tone: "ink" },
  ];
  for (const patch of clipChanges) {
    const changed = {
      ...legacy,
      clips: legacy.clips.map((clip, index) =>
        index === 0 ? { ...clip, ...patch } : clip,
      ),
    };
    assert.equal(isLegacyAutoDemo(changed), false, JSON.stringify(patch));
    assert.equal(isPristineExample(changed), false, JSON.stringify(patch));
  }
});

test("project boundary rejects duplicate IDs across both entity collections", () => {
  const project = mediaProject();
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      assets: [...project.assets, project.assets[0]],
    }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      clips: [...project.clips, project.clips[0]],
    }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      clips: [{ ...project.clips[0], id: project.assets[0].id }],
    }),
  );
});

test("project boundary rejects missing sources and source/track mismatches", () => {
  const project = mediaProject();
  assert.throws(() => projectSchema.parse({ ...project, assets: [] }));
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      clips: [{ ...project.clips[0], trackId: "audio" }],
    }),
  );
  assert.throws(() =>
    projectSchema.parse(
      mediaProject(video({ kind: "audio" }), { trackId: "video" }),
    ),
  );
  for (const clip of [
    createClip({ trackId: "captions" }),
    createClip({ kind: "caption", trackId: "titles" }),
  ]) {
    assert.throws(() =>
      projectSchema.parse({ ...createProject(false), clips: [clip] }),
    );
  }
});

test("project boundary rejects zero/fractional/non-finite frame values", () => {
  const project = mediaProject();
  for (const patch of [
    { duration: 0 },
    { duration: 1.5 },
    { sourceStart: -1 },
    { sourceStart: 0.5 },
    { start: 1.5 },
    { start: Infinity },
    { duration: Number.NaN },
  ]) {
    assert.throws(() =>
      projectSchema.parse({
        ...project,
        clips: [{ ...project.clips[0], ...patch }],
      }),
    );
  }
});

test("project duration limit is 30 minutes at the actual project frame rate", () => {
  for (const fps of [24, 25, 30, 60]) {
    const limit = {
      ...createProject(false),
      fps,
      clips: [createClip({ start: fps * 1800 - 1, duration: 1 })],
    };
    assert.doesNotThrow(() => projectSchema.parse(limit));
    assert.throws(() =>
      projectSchema.parse({
        ...limit,
        clips: [{ ...limit.clips[0], duration: 2 }],
      }),
    );
  }
});

test("project boundary enforces supported frame rates, even dimensions, and collection limits", () => {
  const project = createProject(false);
  for (const patch of [
    { fps: 29.97 },
    { width: 1919 },
    { height: 1079 },
    { width: 3842 },
    { height: 238 },
  ])
    assert.throws(() => projectSchema.parse({ ...project, ...patch }));
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      assets: Array.from({ length: 501 }, (_, i) =>
        video({ id: `asset-${i}` }),
      ),
    }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...project,
      clips: Array.from({ length: 3001 }, (_, i) =>
        createClip({ id: `clip-${i}` }),
      ),
    }),
  );
});

test("timecode rolls frames into seconds and minutes at each supported rate", () => {
  for (const fps of [24, 25, 30, 60]) {
    assert.equal(formatTime(fps * 60, fps), "01:00:00");
    assert.equal(formatTime(fps * 61 + 3, fps), "01:01:03");
  }
  assert.equal(formatTime(-10), "00:00:00");
});
