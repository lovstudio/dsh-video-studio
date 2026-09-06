import assert from "node:assert/strict";
import test from "node:test";
import { createProject } from "../src/core/project";
import {
  projectRecoveryKey,
  readProjectRecovery,
  selectProjectRecovery,
  type EditorStart,
} from "../src/editor/projectRecovery";
import type { ProjectRecovery } from "../src/editor/projectSaves";
import type { Project } from "../src/types";

const a = { sessionId: "session-a", workspacePath: "/workspace" };
const b = { ...a, sessionId: "session-b" };
const stamp = (value: number) => new Date(value * 1000).toISOString();
const project = (scope: EditorStart["scope"], revision = 1): Project => ({
  ...createProject(false),
  dsh: scope && {
    sessionId: scope.sessionId,
    workspacePath: scope.workspacePath,
  },
  updatedAt: stamp(revision),
});
const recovery = (value: Project, dirty = false): ProjectRecovery => ({
  project: value,
  revision: value.updatedAt,
  dirty,
});
const legacyDemo = (scope?: EditorStart["scope"]): Project => {
  const { example: _example, ...legacy } = createProject(true);
  return { ...legacy, ...(scope ? { dsh: scope } : {}) };
};
const select = (
  start: EditorStart,
  records: ProjectRecovery[] = [],
  activeId?: string,
  selectionMode?: "explicit" | "automatic",
) =>
  selectProjectRecovery(
    start,
    { records, activeId, selectionMode },
    createProject(false),
  );
function storage(entries: [string, unknown][]) {
  const values = new Map(
    entries.map(([key, value]) => [key, JSON.stringify(value)]),
  );
  return {
    get length() {
      return values.size;
    },
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    values,
  };
}

test("new sessions create distinct empty projects bound to the real scope and title", () => {
  const first = select({ scope: { ...a, sessionTitle: "  我的预告片  " } });
  const second = select({ scope: { ...b, sessionTitle: " " } });
  assert.notEqual(first.active.project.id, second.active.project.id);
  assert.deepEqual(first.active.project.clips, []);
  assert.deepEqual(second.active.project.clips, []);
  assert.deepEqual(first.active.project.dsh, a);
  assert.deepEqual(second.active.project.dsh, b);
  assert.equal(first.active.project.name, "我的预告片");
  assert.equal(second.active.project.name, "未命名作品");
  assert.equal(first.active.revision, null);
  assert.equal(first.active.dirty, true);
  assert.equal(first.fresh, true);
  assert.equal(
    select({ scope: { ...a, sessionTitle: "长".repeat(300) } }).active.project
      .name.length,
    240,
  );
});

test("after clearing local storage, only the newest server project in this session and workspace opens", () => {
  const older = project(a, 1),
    latest = project(a, 2),
    anotherSession = project(b, 3),
    anotherWorkspace = project({ ...a, workspacePath: "/elsewhere" }, 4);
  const result = select({
    scope: a,
    projects: [anotherSession, older, anotherWorkspace, latest],
  });
  assert.equal(result.active.project, latest);
  assert.equal(result.active.revision, latest.updatedAt);
  assert.equal(result.active.dirty, false);
  assert.equal(result.fresh, false);
  const withoutOwn = select({
    scope: a,
    projects: [anotherSession, anotherWorkspace],
  });
  assert.equal(withoutOwn.fresh, true);
  assert.deepEqual(withoutOwn.active.project.clips, []);
});

test("a dirty local active branch and its base revision survive a newer Agent version", () => {
  const original = project(a),
    local = recovery({ ...original, name: "尚未保存的剪辑" }, true),
    remote = { ...original, name: "Agent 的剪辑", updatedAt: stamp(2) },
    other = recovery(project(a), true);
  const result = select(
    { scope: a, projects: [remote] },
    [local, other],
    original.id,
  );
  assert.equal(result.active, local);
  assert.equal(result.active.revision, stamp(1));
  assert.ok(result.records.includes(other));
  assert.equal(result.fresh, false);
  const noSelection = select({ scope: a, projects: [remote] }, [local]);
  assert.equal(noSelection.active, local);
});

test("a clean local selection adopts its newer server version and revision", () => {
  const original = project(a),
    local = recovery(original),
    remote = { ...original, name: "已保存的新标题", updatedAt: stamp(2) };
  const result = select({ scope: a, projects: [remote] }, [local], original.id);
  assert.equal(result.active.project, remote);
  assert.equal(result.active.revision, remote.updatedAt);
  assert.equal(result.active.dirty, false);
  assert.equal(local.project, original);
});

test("an explicit local selection may reopen another session's project in the same workspace", () => {
  const explicit = recovery(project(b)),
    own = project(a, 2);
  const result = select(
    { scope: a, projects: [explicit.project, own] },
    [explicit],
    explicit.project.id,
    "explicit",
  );
  assert.equal(result.active, explicit);
  const withoutSelection = select(
    { scope: a, projects: [explicit.project, own] },
    [explicit],
  );
  assert.equal(withoutSelection.active.project, own);
});

test("a clean local active project missing from a successful server listing is retained", () => {
  const local = recovery({ ...project(a), name: "服务器丢失时仍可恢复" });
  const result = select({ scope: a, projects: [] }, [local], local.project.id);
  assert.equal(result.active, local);
  assert.equal(result.active.revision, local.project.updatedAt);
  assert.equal(result.active.dirty, false);
  assert.equal(result.fresh, false);
});

test("an unselected old demo and a cross-workspace active draft do not become session defaults", () => {
  const demo = recovery(legacyDemo(), true),
    elsewhere = recovery(project({ ...a, workspacePath: "/elsewhere" }), true);
  for (const activeId of [undefined, elsewhere.project.id]) {
    const result = select(
      { scope: a, projects: [] },
      [demo, elsewhere],
      activeId,
    );
    assert.equal(result.fresh, true);
    assert.deepEqual(result.active.project.clips, []);
    assert.ok(result.records.includes(demo));
    assert.ok(result.records.includes(elsewhere));
    assert.equal(demo.project.clips.length, 3);
  }
});

test("an unmarked legacy selection cannot displace this session's project, but its edited draft survives", () => {
  const local = recovery(
    { ...legacyDemo(), name: "旧版本尚未关联的剪辑" },
    true,
  );
  const legacyKey = `dsh-video-studio-recovery-v1:${a.sessionId}`;
  const stored = readProjectRecovery(storage([[legacyKey, local]]), a);
  const own = project(a);
  const result = selectProjectRecovery(
    { scope: a, projects: [own] },
    stored,
    createProject(false),
  );
  assert.equal(result.active.project, own);
  assert.deepEqual(
    result.records.find((r) => r.project.id === local.project.id),
    local,
  );
  assert.equal(local.project.dsh, undefined);
  assert.equal(local.dirty, true);
  assert.equal(result.fresh, false);
  const explicit = select(
    { scope: a, projects: [own] },
    [local],
    local.project.id,
    "explicit",
  );
  assert.equal(explicit.active, local);
  assert.equal(explicit.active.project.dsh, undefined);
});

test("workspace/session storage keys are isolated and legacy session records are read without removal", () => {
  const legacy = recovery(project(a), true),
    modern = recovery(project(a, 2)),
    other = recovery(project(b));
  const legacyKey = `dsh-video-studio-recovery-v1:${a.sessionId}`;
  const data = storage([
    [legacyKey, { activeProjectId: legacy.project.id }],
    [`${legacyKey}:project:${legacy.project.id}`, legacy],
    [projectRecoveryKey(a), { activeProjectId: modern.project.id }],
    [`${projectRecoveryKey(a)}:project:${modern.project.id}`, modern],
    [projectRecoveryKey(b), { activeProjectId: other.project.id }],
    [`${projectRecoveryKey(b)}:project:${other.project.id}`, other],
  ]);
  const before = [...data.values];
  const first = readProjectRecovery(data, a),
    second = readProjectRecovery(data, b);
  assert.equal(first.activeId, modern.project.id);
  assert.deepEqual(
    first.records.map((r) => r.project.id),
    [legacy.project.id, modern.project.id],
  );
  assert.equal(second.activeId, other.project.id);
  assert.deepEqual(
    second.records.map((r) => r.project.id),
    [other.project.id],
  );
  assert.notEqual(projectRecoveryKey(a), projectRecoveryKey(b));
  assert.notEqual(
    projectRecoveryKey(a),
    projectRecoveryKey({ ...a, workspacePath: "/elsewhere" }),
  );
  assert.deepEqual([...data.values], before);
  const onlyLegacy = readProjectRecovery(storage([[legacyKey, legacy]]), a);
  assert.equal(onlyLegacy.activeId, legacy.project.id);
  assert.equal(
    selectProjectRecovery({ scope: a }, onlyLegacy, createProject(false)).active
      .project.id,
    legacy.project.id,
  );
});

test("standalone mode retains an untouched legacy demo without making it the default", () => {
  const demo = legacyDemo();
  const previous = readProjectRecovery(storage([[projectRecoveryKey(), demo]]));
  const restored = selectProjectRecovery({}, previous, createProject(false));
  assert.notEqual(restored.active.project.id, demo.id);
  assert.ok(restored.records.some((r) => r.project.id === demo.id));
  assert.deepEqual(restored.active.project.clips, []);
  assert.equal(restored.active.dirty, true);
  assert.equal(restored.fresh, true);
  const blank = select({});
  assert.deepEqual(blank.active.project.clips, []);
  assert.equal(blank.active.project.dsh, undefined);
});

test("bound old demos from either legacy or migrated active storage no longer win automatic recovery", () => {
  for (const key of [
    `dsh-video-studio-recovery-v1:${a.sessionId}`,
    projectRecoveryKey(a),
  ]) {
    for (const dirty of [false, true]) {
      const old = recovery(legacyDemo(a), dirty);
      const own = { ...project(a), name: "本会话真实作品" };
      const data = storage([
        [key, { activeProjectId: old.project.id }],
        [`${key}:project:${old.project.id}`, old],
      ]);
      const before = [...data.values];
      const restored = selectProjectRecovery(
        { scope: a, projects: [old.project, own] },
        readProjectRecovery(data, a),
        createProject(),
      );
      assert.equal(restored.active.project, own);
      assert.equal(restored.selectionMode, "automatic");
      assert.deepEqual(
        restored.records.find((r) => r.project.id === old.project.id),
        old,
      );
      assert.deepEqual([...data.values], before);
    }
  }
});

test("server-only bound old demos are retained on the server but are not session defaults", () => {
  const oldest = { ...legacyDemo(a), updatedAt: stamp(1) };
  const latest = { ...legacyDemo(a), updatedAt: stamp(3) };
  const source = JSON.stringify([oldest, latest]);
  const empty = select({
    scope: { ...a, sessionTitle: "正在创作的会话" },
    projects: [oldest, latest],
  });
  assert.equal(empty.fresh, true);
  assert.equal(empty.active.project.name, "正在创作的会话");
  assert.deepEqual(empty.active.project.dsh, a);
  assert.deepEqual(empty.active.project.clips, []);
  assert.equal(JSON.stringify([oldest, latest]), source);
  const own = project(a, 2);
  assert.equal(
    select({ scope: a, projects: [oldest, own, latest] }).active.project,
    own,
  );
});

test("edited old demos stay recoverable, including an unbound six-clip user's version", () => {
  const edited = {
    ...legacyDemo(a),
    clips: legacyDemo().clips.map((clip, i) =>
      i === 0 ? { ...clip, text: "我的新开场" } : clip,
    ),
  };
  for (const dirty of [false, true]) {
    const local = recovery(edited, dirty);
    assert.equal(
      select({ scope: a, projects: [edited] }, [local], edited.id).active,
      local,
    );
  }
  const six = {
    ...legacyDemo(),
    clips: [...legacyDemo().clips, ...legacyDemo().clips],
  };
  const local = recovery(six, true);
  const before = JSON.stringify(local);
  const own = project(a);
  const restored = select({ scope: a, projects: [own] }, [local], six.id);
  assert.equal(restored.active.project, own);
  assert.ok(restored.records.includes(local));
  assert.equal(JSON.stringify(local), before);
  const manual = select(
    { scope: a, projects: [own] },
    [local],
    six.id,
    "explicit",
  );
  assert.equal(manual.active, local);
  assert.equal(manual.active.project.clips.length, 6);
});

test("a user-created example remains a valid session default and survives the project schema", () => {
  const example = { ...createProject(true), dsh: a };
  const local = recovery(example);
  assert.equal(
    select({ scope: a, projects: [example] }).active.project,
    example,
  );
  assert.equal(select({ scope: a }, [local], example.id).active, local);
  const key = projectRecoveryKey(a);
  const stored = readProjectRecovery(
    storage([
      [key, { activeProjectId: example.id, mode: "explicit" }],
      [`${key}:project:${example.id}`, local],
    ]),
    a,
  );
  assert.equal(stored.selectionMode, "explicit");
  assert.deepEqual(stored.records[0].project.example, example.example);
  const result = selectProjectRecovery({ scope: a }, stored, createProject());
  assert.equal(result.active.project.id, example.id);
  assert.equal(result.selectionMode, "explicit");
});

test("automatic or unmarked selections cannot leak another session into this one", () => {
  const another = recovery(project(b), true);
  const own = project(a, 2);
  for (const mode of [undefined, "automatic"] as const) {
    const result = select(
      { scope: a, projects: [another.project, own] },
      [another],
      another.project.id,
      mode,
    );
    assert.equal(result.active.project, own);
    assert.ok(result.records.includes(another));
    const noOwn = select(
      { scope: a, projects: [another.project] },
      [another],
      another.project.id,
      mode,
    );
    assert.equal(noOwn.fresh, true);
    assert.deepEqual(noOwn.active.project.dsh, a);
  }
  const manual = select(
    { scope: a, projects: [own] },
    [another],
    another.project.id,
    "explicit",
  );
  assert.equal(manual.active, another);
});

test("legacy session-only keys cannot import another workspace even when explicitly selected", () => {
  const foreign = recovery(project({ ...a, workspacePath: "/foreign" }), true);
  const key = `dsh-video-studio-recovery-v1:${a.sessionId}`;
  for (const mode of [undefined, "automatic", "explicit"]) {
    const data = storage([
      [key, { activeProjectId: foreign.project.id, mode }],
      [`${key}:project:${foreign.project.id}`, foreign],
    ]);
    const stored = readProjectRecovery(data, a);
    const result = selectProjectRecovery({ scope: a }, stored, createProject());
    assert.equal(result.fresh, true);
    assert.deepEqual(result.active.project.dsh, a);
    assert.deepEqual(
      result.records.find((r) => r.project.id === foreign.project.id),
      foreign,
    );
  }
});

test("a dirty unbound branch is never overwritten by a server default with the same ID", () => {
  const server = project(a);
  const { dsh: _dsh, ...unbound } = server;
  const local = recovery({ ...unbound, name: "未关联且未保存的修改" }, true);
  const result = select(
    { scope: a, projects: [server] },
    [local],
    local.project.id,
  );
  assert.equal(result.fresh, true);
  assert.notEqual(result.active.project.id, server.id);
  assert.ok(result.records.includes(local));
  assert.equal(local.project.name, "未关联且未保存的修改");
});

test("a server candidate cannot indirectly reactivate a dirty legacy demo through its local branch", () => {
  const local = recovery(legacyDemo(a), true);
  const remote = {
    ...local.project,
    name: "Agent 已完成的新版本",
    updatedAt: stamp(100),
  };
  const own = project(a, 2);
  const restored = select(
    { scope: a, projects: [remote, own] },
    [local],
    local.project.id,
  );
  assert.equal(restored.active.project, own);
  assert.ok(restored.records.includes(local));
  assert.equal(local.project.name, "灵感成片 · 开场练习");
});
