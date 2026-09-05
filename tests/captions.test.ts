import assert from "node:assert/strict";
import test from "node:test";
import { exportSrt, parseSrt } from "../src/core/captions";
import {
  captionsToClips,
  createClip,
  createProject,
  projectSchema,
} from "../src/core/project";

test("SRT import preserves multilingual multiline text and supports BOM, CRLF, and dot milliseconds", () => {
  const input =
    "\uFEFF1\r\n00:00:01,250 --> 00:00:02,500\r\n你好，世界。\r\nHello, world.\r\n\r\n2\r\n00:00:03.000 --> 00:00:04.125\r\n第二段\r\n";
  assert.deepEqual(parseSrt(input), [
    { start: 1.25, end: 2.5, text: "你好，世界。\nHello, world." },
    { start: 3, end: 4.125, text: "第二段" },
  ]);
});

test("SRT import rejects empty files, malformed or reversed times, and empty cues", () => {
  for (const input of [
    "",
    "An ordinary text file",
    "1\ninvalid --> time\nCaption",
    "1\n00:00:02,000 --> 00:00:01,000\nCaption",
    "1\n00:00:01,000 --> 00:00:01,000\nCaption",
    "1\n00:00:01,000 --> 00:00:02,000\n",
  ]) {
    assert.throws(() => parseSrt(input));
  }
});

test("SRT import rejects out-of-range minute and second components", () => {
  for (const times of [
    "00:60:00,000 --> 01:01:00,000",
    "00:00:60,000 --> 00:01:01,000",
    "00:00:00,000 --> 00:60:00,000",
    "00:00:00,000 --> 00:00:60,000",
  ]) {
    assert.throws(() => parseSrt(`1\n${times}\nCaption`));
  }
});

test("SRT import does not partially accept a file containing a malformed timed cue", () => {
  assert.throws(() =>
    parseSrt(
      "1\n00:00:00,000 --> 00:00:01,000\nFirst\n\n2\n00:00:02 --> 00:00:03\nSecond",
    ),
  );
});

test("caption conversion quantizes absolute endpoints to avoid drift between adjacent cues", () => {
  const clips = captionsToClips(
    [
      { start: 0.049, end: 1.084, text: "First" },
      { start: 1.084, end: 2, text: "Second" },
    ],
    30,
    60,
  );
  assert.equal(clips[0].start, 61);
  assert.equal(clips[0].start + clips[0].duration, 93);
  assert.equal(clips[1].start, 93);
  assert.equal(clips[1].start + clips[1].duration, 120);
  assert.doesNotThrow(() =>
    projectSchema.parse({ ...createProject(false), clips }),
  );
});

test("caption conversion omits blank and backwards cues and retains a short cue for one frame", () => {
  const clips = captionsToClips(
    [
      { start: 0, end: 1, text: "  " },
      { start: 2, end: 1, text: "Invalid" },
      { start: 2, end: 2.001, text: "短字幕" },
    ],
    30,
  );
  assert.equal(clips.length, 1);
  assert.equal(clips[0].start, 60);
  assert.equal(clips[0].duration, 1);
  assert.equal(clips[0].trackId, "captions");
  assert.equal(clips[0].kind, "caption");
});

test("SRT export sorts captions without reordering the project and excludes titles", () => {
  const project = {
    ...createProject(false),
    clips: [
      createClip({
        id: "late",
        kind: "caption",
        trackId: "captions",
        start: 60,
        duration: 30,
        text: "第二句\nSecond line",
      }),
      createClip({
        id: "title",
        kind: "title",
        start: 0,
        text: "Not a caption",
      }),
      createClip({
        id: "early",
        kind: "caption",
        trackId: "captions",
        start: 15,
        duration: 30,
        text: "第一句",
      }),
    ],
  };
  const output = exportSrt(project);
  assert.equal(
    output,
    "1\n00:00:00,500 --> 00:00:01,500\n第一句\n\n2\n00:00:02,000 --> 00:00:03,000\n第二句\nSecond line\n",
  );
  assert.deepEqual(
    project.clips.map((clip) => clip.id),
    ["late", "title", "early"],
  );
  assert.equal(exportSrt(createProject(false)), "");
});

test("SRT export handles minute/hour rollover and round-trips frame-aligned cues", () => {
  for (const fps of [24, 25, 30, 60]) {
    const project = {
      ...createProject(false),
      fps,
      clips: [
        createClip({
          kind: "caption",
          trackId: "captions",
          start: fps * 3600 - 1,
          duration: 2,
          text: "跨小时",
        }),
      ],
    };
    const output = exportSrt(project);
    assert.match(output, /00:59:59,\d{3} --> 01:00:00,\d{3}/);
    const roundTrip = captionsToClips(parseSrt(output), fps);
    assert.equal(roundTrip[0].start, project.clips[0].start);
    assert.equal(roundTrip[0].duration, 2);
    assert.equal(roundTrip[0].text, "跨小时");
  }
});
