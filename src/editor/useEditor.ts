import { useCallback, useEffect, useRef, useState } from "react";
import { createProject, projectSchema } from "../core/project";
import type { Project } from "../types";
import { request } from "./api";

const RECOVERY_KEY = "dsh-video-studio-recovery-v1";
export type SaveState = {
  status: "saved" | "pending" | "saving" | "error";
  message?: string;
};
function initialProject() {
  try {
    const saved = localStorage.getItem(RECOVERY_KEY);
    if (saved) return projectSchema.parse(JSON.parse(saved));
  } catch {
    /* A corrupt recovery must not prevent opening the editor. */
  }
  return createProject();
}
export function useEditor() {
  const [project, setProject] = useState<Project>(initialProject);
  const current = useRef(project),
    past = useRef<Project[]>([]),
    future = useRef<Project[]>([]);
  const [history, setHistory] = useState({ undo: false, redo: false });
  const [save, setSave] = useState<SaveState>({ status: "pending" });
  const queue = useRef(new Map<string, Project>()),
    busy = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const publish = useCallback((next: Project) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    current.current = updated;
    setProject(updated);
    setSave({ status: "pending" });
    setHistory({
      undo: past.current.length > 0,
      redo: future.current.length > 0,
    });
  }, []);
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
      // Preserve the previous project in the save queue before switching documents.
      queue.current.set(current.current.id, current.current);
      past.current = [];
      future.current = [];
      publish(projectSchema.parse(next));
    },
    [publish],
  );
  const flush = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    while (queue.current.size && mounted.current) {
      const [id, snapshot] = queue.current.entries().next().value!;
      queue.current.delete(id);
      if (id === current.current.id) setSave({ status: "saving" });
      try {
        await request<Project>(`projects/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: JSON.stringify(snapshot),
        });
        if (
          mounted.current &&
          id === current.current.id &&
          snapshot === current.current
        )
          setSave({ status: "saved" });
      } catch (error) {
        if (mounted.current && id === current.current.id)
          setSave({
            status: "error",
            message: error instanceof Error ? error.message : "保存失败",
          });
        // Keep later edits; retry is explicit after failures to avoid a tight request loop.
        if (!queue.current.has(id)) queue.current.set(id, snapshot);
        break;
      }
    }
    busy.current = false;
  }, []);
  const retry = useCallback(() => {
    queue.current.set(current.current.id, current.current);
    void flush();
  }, [flush]);
  useEffect(() => {
    try {
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(project));
    } catch {
      setSave({
        status: "error",
        message: "浏览器备份空间已满，请导出工程备份",
      });
    }
    const timer = setTimeout(() => {
      queue.current.set(project.id, project);
      void flush();
    }, 700);
    return () => clearTimeout(timer);
  }, [project, flush]);
  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (save.status !== "saved") {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [save.status]);
  return { project, edit, undo, redo, history, save, retry, load, current };
}
