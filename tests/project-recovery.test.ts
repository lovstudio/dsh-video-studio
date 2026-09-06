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
const select = (
  start: EditorStart,
  records: ProjectRecovery[] = [],
  activeId?: string,
) => selectProjectRecovery(start, { records, activeId }, createProject(false));
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
  const demo = recovery(createProject(true), true),
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

test("an explicitly active unbound legacy draft stays visible without being silently bound", () => {
  const local = recovery(
    { ...createProject(true), name: "旧版本尚未关联的剪辑" },
    true,
  );
  const legacyKey = `dsh-video-studio-recovery-v1:${a.sessionId}`;
  const stored = readProjectRecovery(storage([[legacyKey, local]]), a);
  const result = selectProjectRecovery(
    { scope: a, projects: [project(a)] },
    stored,
    createProject(false),
  );
  assert.deepEqual(result.active, local);
  assert.equal(result.active.project.dsh, undefined);
  assert.equal(result.active.dirty, true);
  assert.equal(result.fresh, false);
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

test("standalone mode preserves legacy local work but no longer starts with a demo", () => {
  const demo = createProject(true);
  const previous = readProjectRecovery(storage([[projectRecoveryKey(), demo]]));
  const restored = selectProjectRecovery({}, previous, createProject(false));
  assert.deepEqual(restored.active.project, demo);
  assert.equal(restored.active.dirty, true);
  assert.equal(restored.fresh, false);
  const blank = select({});
  assert.deepEqual(blank.active.project.clips, []);
  assert.equal(blank.active.project.dsh, undefined);
});
