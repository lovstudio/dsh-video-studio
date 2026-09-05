import type { Project } from "../types";
import { StudioApiError } from "./api";

export type SaveState = {
  status: "saved" | "pending" | "saving" | "error" | "conflict";
  message?: string;
};
export interface ProjectRecovery {
  project: Project;
  revision?: string | null;
  dirty: boolean;
}
export interface ProjectSaveRecord extends ProjectRecovery {
  state: SaveState;
  error?: Error;
}
interface SaveTransport {
  read(id: string): Promise<Project>;
  write(project: Project, revision: string | null): Promise<Project>;
}

/** A revision belongs to one document's editing branch, never to an arbitrary loaded snapshot. */
export class ProjectSaves {
  private records = new Map<string, ProjectSaveRecord>();
  private pending = new Set<string>();
  private running: Promise<void> | null = null;
  private listeners = new Set<(record: ProjectSaveRecord) => void>();

  constructor(
    private readonly transport: SaveTransport,
    recoveries: ProjectRecovery[],
  ) {
    for (const recovery of recoveries)
      this.records.set(recovery.project.id, {
        ...recovery,
        state: { status: recovery.dirty ? "pending" : "saved" },
      });
  }
  get(id: string): ProjectSaveRecord {
    const record = this.records.get(id);
    if (!record) throw new Error("工程尚未载入");
    return record;
  }
  subscribe(listener: (record: ProjectSaveRecord) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private changed(record: ProjectSaveRecord): void {
    for (const listener of this.listeners) listener(record);
  }
  get hasUnsaved(): boolean {
    return [...this.records.values()].some((record) => record.dirty);
  }
  /** Switching back restores an unsaved branch; other snapshots must establish their own base. */
  open(project: Project): ProjectSaveRecord {
    const previous = this.records.get(project.id);
    if (previous?.dirty) return previous;
    const record: ProjectSaveRecord = {
      project,
      dirty: true,
      state: { status: "pending" },
    };
    this.records.set(project.id, record);
    this.changed(record);
    return record;
  }
  edit(project: Project): void {
    const record = this.get(project.id);
    record.project = project;
    record.dirty = true;
    record.error = undefined;
    record.state = { status: "pending" };
    this.changed(record);
  }
  enqueue(id: string): Promise<void> {
    if (this.get(id).dirty) this.pending.add(id);
    return this.flush();
  }
  private flush(): Promise<void> {
    if (this.running) return this.running;
    this.running = Promise.resolve()
      .then(async () => {
        while (this.pending.size) {
          const id = this.pending.values().next().value!;
          this.pending.delete(id);
          const record = this.get(id);
          // A second request for an in-flight snapshot becomes a no-op after its commit.
          if (!record.dirty) continue;
          const snapshot = record.project;
          record.error = undefined;
          record.state = { status: "saving" };
          this.changed(record);
          try {
            let unchanged: Project | undefined;
            if (record.revision === undefined) {
              try {
                const remote = await this.transport.read(id);
                if (remote.updatedAt !== snapshot.updatedAt)
                  throw new StudioApiError(
                    "工程已有更新版本，请载入最新版本后继续。",
                    409,
                  );
                record.revision = remote.updatedAt;
                if (JSON.stringify(remote) === JSON.stringify(snapshot))
                  unchanged = remote;
              } catch (error) {
                if (error instanceof StudioApiError && error.status === 404)
                  record.revision = null;
                else throw error;
              }
            }
            const committed =
              unchanged ??
              (await this.transport.write(snapshot, record.revision));
            record.revision = committed.updatedAt;
            if (record.project === snapshot) {
              record.project = committed;
              record.dirty = false;
              record.state = { status: "saved" };
            } else record.state = { status: "pending" };
          } catch (error) {
            record.error =
              error instanceof Error ? error : new Error("保存失败");
            record.state = {
              status:
                error instanceof StudioApiError && error.status === 409
                  ? "conflict"
                  : "error",
              message: record.error.message,
            };
            // Preserve this branch without blocking other documents or retrying forever.
            this.pending.delete(id);
          }
          this.changed(record);
        }
      })
      .finally(() => {
        this.running = null;
      });
    return this.running;
  }
  async save(id: string): Promise<Project> {
    while (this.get(id).dirty) {
      await this.enqueue(id);
      const record = this.get(id);
      if (record.error) throw record.error;
    }
    return this.get(id).project;
  }
  async settled(): Promise<void> {
    if (this.running) await this.running;
  }
  accept(remote: Project, force = false): boolean {
    const record = this.get(remote.id);
    if (
      !force &&
      (record.dirty || !record.revision || remote.updatedAt <= record.revision)
    )
      return false;
    this.pending.delete(remote.id);
    record.project = remote;
    record.revision = remote.updatedAt;
    record.dirty = false;
    record.error = undefined;
    record.state = { status: "saved" };
    this.changed(record);
    return true;
  }
}
