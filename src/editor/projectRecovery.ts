import { projectSchema } from "../core/project";
import type { Project } from "../types";
import type { ProjectRecovery } from "./projectSaves";

export type EditorStart = {
  scope?: {
    sessionId: string;
    workspacePath: string;
    sessionTitle?: string;
  };
  projects?: Project[];
};
export interface StoredProjectRecovery {
  activeId?: string;
  records: ProjectRecovery[];
}
type RecoveryStorage = Pick<Storage, "length" | "key" | "getItem">;

export function projectRecoveryKey(scope?: EditorStart["scope"]): string {
  return scope
    ? `dsh-video-studio-recovery-v2:${encodeURIComponent(scope.workspacePath)}:${encodeURIComponent(scope.sessionId)}`
    : "dsh-video-studio-recovery-v1";
}

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

/** Read legacy storage without removing it; an invalid record cannot hide other drafts. */
export function readProjectRecovery(
  storage: RecoveryStorage,
  scope?: EditorStart["scope"],
): StoredProjectRecovery {
  const keys = scope
    ? [
        `dsh-video-studio-recovery-v1:${scope.sessionId}`,
        projectRecoveryKey(scope),
      ]
    : [projectRecoveryKey()];
  const records = new Map<string, ProjectRecovery>();
  let activeId: string | undefined;
  for (const base of keys) {
    try {
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (!key?.startsWith(`${base}:project:`)) continue;
        try {
          const record = parseRecovery(
            JSON.parse(storage.getItem(key) || "null"),
          );
          records.set(record.project.id, record);
        } catch {
          /* Keep other recoveries available when one record is damaged. */
        }
      }
      const previous = JSON.parse(storage.getItem(base) || "null");
      if (typeof previous?.activeProjectId === "string")
        activeId = previous.activeProjectId;
      else if (previous) {
        const legacy = parseRecovery(previous);
        if (!records.has(legacy.project.id))
          records.set(legacy.project.id, legacy);
        activeId = legacy.project.id;
      }
    } catch {
      /* Server recovery still works if browser storage is unavailable. */
    }
  }
  return { activeId, records: [...records.values()] };
}

/** Server defaults are session-specific; only an explicit local selection can cross sessions. */
export function selectProjectRecovery(
  start: EditorStart,
  stored: StoredProjectRecovery,
  blank: Project,
): { active: ProjectRecovery; records: ProjectRecovery[]; fresh: boolean } {
  const inWorkspace = (project: Project) =>
    !start.scope || project.dsh?.workspacePath === start.scope.workspacePath;
  const server = new Map(
    start.projects?.map((project) => [project.id, project]),
  );
  const records = new Map(
    stored.records.map((record) => {
      const remote = server.get(record.project.id);
      const updated =
        !record.dirty &&
        remote &&
        inWorkspace(remote) &&
        remote.updatedAt > record.project.updatedAt
          ? { project: remote, revision: remote.updatedAt, dirty: false }
          : record;
      return [updated.project.id, updated];
    }),
  );
  const restored = stored.activeId ? records.get(stored.activeId) : undefined;
  let active =
    restored && (!restored.project.dsh || inWorkspace(restored.project))
      ? restored
      : undefined;
  if (!active && start.scope) {
    const { sessionId } = start.scope;
    const candidate = [...server.values()]
      .filter((project) => {
        const local = records.get(project.id);
        return (
          inWorkspace(project) &&
          project.dsh?.sessionId === sessionId &&
          (!local?.dirty || inWorkspace(local.project))
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    if (candidate) {
      const local = records.get(candidate.id);
      active =
        local && inWorkspace(local.project)
          ? local
          : {
              project: candidate,
              revision: candidate.updatedAt,
              dirty: false,
            };
    }
  }
  const fresh = !active;
  active ??= {
    project: {
      ...blank,
      name: start.scope?.sessionTitle?.trim().slice(0, 240) || "未命名作品",
      ...(start.scope
        ? {
            dsh: {
              workspacePath: start.scope.workspacePath,
              sessionId: start.scope.sessionId,
            },
          }
        : {}),
    },
    revision: null,
    dirty: true,
  };
  records.set(active.project.id, active);
  return { active, records: [...records.values()], fresh };
}
