import assert from "node:assert/strict";
import test from "node:test";
import { createProject } from "../src/core/project";
import { StudioApiError } from "../src/editor/api";
import { ProjectSaves, type ProjectRecovery } from "../src/editor/projectSaves";
import type { Project } from "../src/types";

const stamp = (revision: number) => new Date(revision * 1000).toISOString();
const project = (id: string, revision = 1): Project => ({
  ...createProject(false),
  id,
  name: id,
  updatedAt: stamp(revision),
});
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
function fixture(initial: Project[], recoveries?: ProjectRecovery[]) {
  const server = new Map(initial.map((value) => [value.id, value]));
  const writes: { snapshot: Project; revision: string | null }[] = [];
  const reads: string[] = [];
  const durable = new Map<string, string>();
  let beforeWrite: (value: Project) => Promise<void> = async () => {};
  const transport = {
    async read(id: string) {
      reads.push(id);
      const value = server.get(id);
      if (!value) throw new StudioApiError("Not found", 404);
      return structuredClone(value);
    },
    async write(snapshot: Project, revision: string | null) {
      writes.push({ snapshot, revision });
      await beforeWrite(snapshot);
      const previous = server.get(snapshot.id);
      if (revision !== (previous?.updatedAt ?? null))
        throw new StudioApiError("Conflict", 409);
      const committed = {
        ...snapshot,
        updatedAt: new Date(
          Date.parse(previous?.updatedAt ?? stamp(0)) + 1000,
        ).toISOString(),
      };
      server.set(snapshot.id, committed);
      return committed;
    },
  };
  const saves = new ProjectSaves(
    transport,
    recoveries ??
      initial.map((value) => ({
        project: value,
        revision: value.updatedAt,
        dirty: false,
      })),
  );
  saves.subscribe(({ project: value, revision, dirty }) => {
    durable.set(value.id, JSON.stringify({ project: value, revision, dirty }));
  });
  return {
    saves,
    server,
    writes,
    reads,
    durable,
    transport,
    block: (fn: typeof beforeWrite) => {
      beforeWrite = fn;
    },
  };
}

test("an overlapping debounce and saveNow submit the same snapshot only once and settle saved", async () => {
  const original = project("a"),
    f = fixture([original]);
  const entered = deferred(),
    release = deferred();
  f.block(async () => {
    entered.resolve();
    await release.promise;
  });
  f.saves.edit({ ...original, name: "修改后的作品" });
  const saving = f.saves.save("a");
  await entered.promise;
  const duplicateDebounce = f.saves.enqueue("a");
  release.resolve();
  const [committed] = await Promise.all([saving, duplicateDebounce]);
  assert.equal(f.writes.length, 1);
  assert.equal(f.saves.get("a").state.status, "saved");
  assert.equal(committed.updatedAt, f.server.get("a")?.updatedAt);
  assert.equal(f.saves.hasUnsaved, false);
});

test("edits made during a slow save retain their branch and saveNow returns the latest committed draft", async () => {
  const original = project("a"),
    f = fixture([original]);
  const entered = deferred(),
    release = deferred();
  f.block(async () => {
    entered.resolve();
    await release.promise;
  });
  f.saves.edit({ ...original, name: "第一次修改" });
  const saving = f.saves.save("a");
  await entered.promise;
  f.saves.edit({ ...f.saves.get("a").project, name: "保存中继续修改" });
  release.resolve();
  const committed = await saving;
  assert.equal(committed.name, "保存中继续修改");
  assert.deepEqual(
    f.writes.map((entry) => entry.revision),
    [stamp(1), stamp(2)],
  );
  assert.equal(f.server.get("a")?.name, committed.name);
  assert.equal(f.saves.get("a").state.status, "saved");
});

test("a stale gallery snapshot never borrows a newer remembered revision to overwrite saved work", async () => {
  const original = project("a"),
    f = fixture([original]);
  f.saves.edit({ ...original, name: "已保存的新内容" });
  const latest = await f.saves.save("a");
  f.saves.open(structuredClone(original));
  assert.equal(f.saves.get("a").revision, undefined);
  await assert.rejects(
    f.saves.save("a"),
    (error: unknown) => error instanceof StudioApiError && error.status === 409,
  );
  assert.equal(f.writes.length, 1);
  assert.deepEqual(f.server.get("a"), latest);
  assert.equal(f.saves.get("a").state.status, "conflict");
});

test("switching away and back prefers the pending local branch over an older gallery snapshot", async () => {
  const a = project("a"),
    b = project("b"),
    f = fixture([a, b]);
  const draft = { ...a, name: "还未保存的修改" };
  f.saves.edit(draft);
  f.saves.open(b);
  const reopened = f.saves.open(structuredClone(a));
  assert.equal(reopened.project, draft);
  assert.equal(reopened.revision, a.updatedAt);
  assert.equal(reopened.dirty, true);
  await f.saves.save("a");
  assert.equal(f.server.get("a")?.name, draft.name);
});

test("one project's conflict neither blocks another project nor poisons its save result, and both recoveries persist", async () => {
  const a = project("a"),
    b = project("b"),
    f = fixture([a, b]);
  f.saves.edit({ ...a, name: "A 的本地修改" });
  f.saves.edit({ ...b, name: "B 的本地修改" });
  f.server.set("a", { ...a, name: "Agent 刚保存的 A", updatedAt: stamp(2) });
  const backgroundA = f.saves.enqueue("a");
  const savedB = await f.saves.save("b");
  await backgroundA;
  assert.equal(savedB.name, "B 的本地修改");
  assert.equal(f.saves.get("b").state.status, "saved");
  assert.equal(f.saves.get("a").state.status, "conflict");
  assert.equal(f.server.get("a")?.name, "Agent 刚保存的 A");
  assert.equal(f.saves.hasUnsaved, true);
  const localA = JSON.parse(f.durable.get("a")!);
  assert.equal(localA.project.name, "A 的本地修改");
  assert.equal(localA.revision, stamp(1));
  assert.equal(localA.dirty, true);
  assert.equal(JSON.parse(f.durable.get("b")!).dirty, false);
});

test("restored dirty projects keep their recovery revision and force reload clears only the chosen project", async () => {
  const a = project("a", 2),
    b = project("b"),
    f = fixture(
      [a, b],
      [
        {
          project: { ...a, name: "A 的未保存恢复", updatedAt: stamp(1) },
          revision: stamp(1),
          dirty: true,
        },
        {
          project: { ...b, name: "B 的未保存恢复" },
          revision: stamp(1),
          dirty: true,
        },
      ],
    );
  assert.equal(f.saves.open(a).project.name, "A 的未保存恢复");
  await assert.rejects(f.saves.save("a"), /Conflict/);
  assert.equal(f.saves.accept(a, true), true);
  assert.equal(f.saves.get("a").dirty, false);
  assert.equal(f.saves.get("b").project.name, "B 的未保存恢复");
  assert.equal(f.saves.hasUnsaved, true);
});

test("Agent polling accepts only newer clean revisions and never replaces local dirty work", async () => {
  const a = project("a"),
    f = fixture([a]);
  const remote = { ...a, name: "Agent 更新", updatedAt: stamp(2) };
  assert.equal(f.saves.accept(remote), true);
  assert.equal(f.saves.accept(a), false);
  const local = { ...remote, name: "用户继续编辑" };
  f.saves.edit(local);
  assert.equal(f.saves.accept({ ...remote, updatedAt: stamp(3) }), false);
  assert.equal(f.saves.get("a").project, local);
});

test("opening a matching server document validates it without a redundant write", async () => {
  const a = project("a"),
    f = fixture([a]);
  f.saves.open(structuredClone(a));
  const loaded = await f.saves.save("a");
  assert.deepEqual(f.reads, ["a"]);
  assert.equal(f.writes.length, 0);
  assert.deepEqual(loaded, a);
  assert.equal(f.saves.hasUnsaved, false);
});
