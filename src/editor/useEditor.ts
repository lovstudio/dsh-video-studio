import { useCallback, useEffect, useRef, useState } from "react";
import { createProject, projectSchema } from "../core/project";
import type { Project } from "../types";
import { request } from "./api";
import {
  ProjectSaves,
  type ProjectRecovery,
  type SaveState,
} from "./projectSaves";

export type { SaveState } from "./projectSaves";

const sessionId = new URLSearchParams(location.search).get("sessionId");
const RECOVERY_KEY = `dsh-video-studio-recovery-v1${sessionId ? `:${sessionId}` : ""}`;
const PROJECT_KEY = `${RECOVERY_KEY}:project:`;

function parseRecovery(value: unknown): ProjectRecovery {
  const raw = value as {
    project?: unknown;
    revision?: unknown;
    dirty?: unknown;
  };
  return {
    project: projectSchema.parse(raw.project ?? value),
    revision:
      raw.revision === null || typeof raw.revision === "string"
        ? raw.revision
        : undefined,
    dirty: raw.dirty !== false,
  };
}

function initialRecovery(): {
  active: ProjectRecovery;
  records: ProjectRecovery[];
  fresh: boolean;
} {
  const records = new Map<string, ProjectRecovery>();
  let activeId: string | undefined;
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(PROJECT_KEY)) continue;
      try {
        const record = parseRecovery(
          JSON.parse(localStorage.getItem(key) || "null"),
        );
        records.set(record.project.id, record);
      } catch {
        /* One damaged document must not hide other recoveries. */
      }
    }
    const previous = JSON.parse(localStorage.getItem(RECOVERY_KEY) || "null");
    if (previous?.activeProjectId) activeId = previous.activeProjectId;
    else if (previous) {
      const legacy = parseRecovery(previous);
      if (!records.has(legacy.project.id))
        records.set(legacy.project.id, legacy);
      activeId = legacy.project.id;
    }
  } catch {
    /* Browser storage may be unavailable. Server saves still work. */
  }
  const restored = activeId ? records.get(activeId) : undefined;
  const active = restored ?? {
    project: createProject(),
    revision: null,
    dirty: true,
  };
  records.set(active.project.id, active);
  return { active, records: [...records.values()], fresh: !restored };
}

function persistRecord(record: ProjectRecovery): void {
  try {
    localStorage.setItem(
      `${PROJECT_KEY}${record.project.id}`,
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

function persistSelection(id: string): void {
  try {
    localStorage.setItem(RECOVERY_KEY, JSON.stringify({ activeProjectId: id }));
  } catch {
    /* Server persistence remains available. */
  }
}

export function useEditor() {
  const [initial] = useState(initialRecovery);
  const [project, setProject] = useState(initial.active.project);
  const current = useRef(project),
    fresh = useRef(initial.fresh);
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
    coordinator.subscribe(persistRecord);
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
      persistRecord(saves.get(next.id));
      updateHistory();
    },
    [saves, updateHistory],
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
      cancelDebounce();
      const previousId = current.current.id;
      if (saves.get(previousId).dirty) void saves.enqueue(previousId);
      const restored = saves.open(parsed);
      past.current = [];
      future.current = [];
      fresh.current = false;
      current.current = restored.project;
      setProject(restored.project);
      setSave(restored.state);
      updateHistory();
      persistRecord(restored);
      persistSelection(restored.project.id);
    },
    [cancelDebounce, saves, updateHistory],
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
    persistRecord(record);
    persistSelection(project.id);
    if (record.dirty)
      timer.current = setTimeout(() => {
        timer.current = undefined;
        void saves.enqueue(project.id);
      }, 700);
    return cancelDebounce;
  }, [project, saves, cancelDebounce]);

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
  };
}
