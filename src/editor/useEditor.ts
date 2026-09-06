import { useCallback, useEffect, useRef, useState } from "react";
import {
  createProject,
  isLegacyAutoDemo,
  projectSchema,
} from "../core/project";
import type { Project } from "../types";
import { request } from "./api";
import {
  ProjectSaves,
  type ProjectRecovery,
  type SaveState,
} from "./projectSaves";
import {
  projectRecoveryKey,
  readProjectRecovery,
  selectProjectRecovery,
  type EditorStart,
} from "./projectRecovery";

export type { SaveState } from "./projectSaves";
export type { EditorStart } from "./projectRecovery";

function initialRecovery(start: EditorStart) {
  let stored: ReturnType<typeof readProjectRecovery> = { records: [] };
  try {
    stored = readProjectRecovery(localStorage, start.scope);
  } catch {
    /* Browser storage may be unavailable. Server saves still work. */
  }
  const selection = selectProjectRecovery(start, stored, createProject(false));
  return {
    ...selection,
    // Foreign v1 drafts remain in their original storage, outside this session's save queue.
    records: selection.records.filter(
      (record) =>
        !start.scope ||
        !record.project.dsh ||
        record.project.dsh.workspacePath === start.scope.workspacePath,
    ),
    key: projectRecoveryKey(start.scope),
  };
}

function persistRecord(key: string, record: ProjectRecovery): void {
  try {
    localStorage.setItem(
      `${key}:project:${record.project.id}`,
      JSON.stringify({
        project: record.project,
        revision: record.revision,
        dirty: record.dirty,
      }),
    );
  } catch {
    /* A full browser store must not prevent server persistence. */
  }
}

function persistSelection(
  key: string,
  id: string,
  mode: "automatic" | "explicit",
): void {
  try {
    localStorage.setItem(key, JSON.stringify({ activeProjectId: id, mode }));
  } catch {
    /* Server persistence remains available. */
  }
}

export function useEditor(start: EditorStart = {}) {
  const [initial] = useState(() => initialRecovery(start));
  const [project, setProject] = useState(initial.active.project);
  const current = useRef(project),
    fresh = useRef(initial.fresh);
  const selectionMode = useRef(initial.selectionMode);
  const recoveryIds = useRef(
    new Set(initial.records.map((record) => record.project.id)),
  );
  const [saves] = useState(() => {
    const coordinator = new ProjectSaves(
      {
        read: (id) => request<Project>(`projects/${encodeURIComponent(id)}`),
        write: (snapshot, revision) =>
          request<Project>(`projects/${encodeURIComponent(snapshot.id)}`, {
            method: "PUT",
            body: JSON.stringify(snapshot),
            headers: { "x-studio-revision": revision ?? "new" },
          }),
      },
      initial.records,
    );
    // A request may settle after the editor unmounts; its committed recovery must still be recorded.
    coordinator.subscribe((record) => persistRecord(initial.key, record));
    return coordinator;
  });
  const past = useRef<Project[]>([]),
    future = useRef<Project[]>([]);
  const [history, setHistory] = useState({ undo: false, redo: false });
  const [save, setSave] = useState<SaveState>(saves.get(project.id).state);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelDebounce = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);
  const updateHistory = useCallback(
    () =>
      setHistory({
        undo: past.current.length > 0,
        redo: future.current.length > 0,
      }),
    [],
  );

  useEffect(
    () =>
      saves.subscribe((record) => {
        if (record.project.id !== current.current.id) return;
        current.current = record.project;
        setProject(record.project);
        setSave(record.state);
      }),
    [saves],
  );

  const publish = useCallback(
    (next: Project) => {
      current.current = next;
      setProject(next);
      saves.edit(next);
      setSave(saves.get(next.id).state);
      persistRecord(initial.key, saves.get(next.id));
      updateHistory();
    },
    [saves, updateHistory, initial.key],
  );
  const edit = useCallback(
    (change: (value: Project) => Project) => {
      const previous = current.current,
        next = change(previous);
      if (next === previous) return;
      past.current = [...past.current.slice(-79), previous];
      future.current = [];
      publish(next);
    },
    [publish],
  );
  const undo = useCallback(() => {
    const previous = past.current.pop();
    if (previous) {
      future.current.push(current.current);
      publish(previous);
    }
  }, [publish]);
  const redo = useCallback(() => {
    const next = future.current.pop();
    if (next) {
      past.current.push(current.current);
      publish(next);
    }
  }, [publish]);
  const load = useCallback(
    (next: Project) => {
      const parsed = projectSchema.parse(next);
      if (
        start.scope &&
        parsed.dsh &&
        parsed.dsh.workspacePath !== start.scope.workspacePath
      )
        throw new Error("此工程属于另一个 DSH 工作区，请在对应工作区打开。");
      cancelDebounce();
      const previousId = current.current.id;
      if (saves.get(previousId).dirty) void saves.enqueue(previousId);
      const restored = saves.open(parsed);
      // Opening a retained old example is now a real user choice, not an automatic migration.
      if (isLegacyAutoDemo(restored.project))
        saves.edit({
          ...restored.project,
          example: { template: "opening-v1", source: "user" },
        });
      recoveryIds.current.add(restored.project.id);
      past.current = [];
      future.current = [];
      fresh.current = false;
      selectionMode.current = "explicit";
      current.current = restored.project;
      setProject(restored.project);
      setSave(restored.state);
      updateHistory();
      persistRecord(initial.key, restored);
      persistSelection(initial.key, restored.project.id, selectionMode.current);
    },
    [cancelDebounce, saves, updateHistory, initial.key, start.scope],
  );

  const saveNow = useCallback(async () => {
    cancelDebounce();
    const id = current.current.id;
    const committed = await saves.save(id);
    if (current.current.id !== id)
      throw new Error("保存期间已切换工程，请在当前工程重试此操作。");
    return committed;
  }, [cancelDebounce, saves]);
  const retry = useCallback(() => {
    void saveNow().catch(() => undefined);
  }, [saveNow]);
  useEffect(() => {
    cancelDebounce();
    const record = saves.get(project.id);
    persistRecord(initial.key, record);
    persistSelection(initial.key, project.id, selectionMode.current);
    if (record.dirty)
      timer.current = setTimeout(() => {
        timer.current = undefined;
        void saves.enqueue(project.id);
      }, 700);
    return cancelDebounce;
  }, [project, saves, cancelDebounce, initial.key]);

  const acceptServer = useCallback(
    (remote: Project, force = false) => {
      if (remote.id !== current.current.id) return;
      const previous = current.current;
      if (!saves.accept(remote, force)) return;
      cancelDebounce();
      past.current = [...past.current.slice(-79), previous];
      future.current = [];
      updateHistory();
    },
    [cancelDebounce, saves, updateHistory],
  );
  const reload = useCallback(async () => {
    cancelDebounce();
    const id = current.current.id;
    await saves.settled();
    const before = saves.get(id).project;
    const remote = await request<Project>(`projects/${encodeURIComponent(id)}`);
    if (current.current.id !== id) return;
    if (saves.get(id).project !== before)
      throw new Error("载入期间产生了新的修改，请备份后再次载入。");
    acceptServer(remote, true);
  }, [acceptServer, cancelDebounce, saves]);
  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (saves.hasUnsaved) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [saves]);
  return {
    project,
    edit,
    undo,
    redo,
    history,
    save,
    retry,
    load,
    current,
    saveNow,
    acceptServer,
    reload,
    fresh,
    recoveries: [...recoveryIds.current]
      .map((id) => saves.get(id).project)
      .filter(
        (record) =>
          record.id !== project.id &&
          (!start.scope ||
            !record.dsh ||
            record.dsh.workspacePath === start.scope.workspacePath),
      ),
  };
}
