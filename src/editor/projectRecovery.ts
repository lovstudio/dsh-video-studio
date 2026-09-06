import { isLegacyAutoDemo, projectSchema } from "../core/project";
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
  selectionMode?: "automatic" | "explicit";
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
  let selectionMode: StoredProjectRecovery["selectionMode"];
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
      if (typeof previous?.activeProjectId === "string") {
        activeId = previous.activeProjectId;
        // Older versions wrote activeProjectId even for automatically created demos.
        selectionMode = previous.mode === "explicit" ? "explicit" : "automatic";
      } else if (previous) {
        const legacy = parseRecovery(previous);
        if (!records.has(legacy.project.id))
          records.set(legacy.project.id, legacy);
        activeId = legacy.project.id;
        selectionMode = "automatic";
      }
    } catch {
      /* Server recovery still works if browser storage is unavailable. */
    }
  }
  return { activeId, selectionMode, records: [...records.values()] };
}

/** Unbound legacy drafts stay recoverable; only a recorded user choice can open one by default. */
export function selectProjectRecovery(
  start: EditorStart,
  stored: StoredProjectRecovery,
  blank: Project,
): {
  active: ProjectRecovery;
  records: ProjectRecovery[];
  fresh: boolean;
  selectionMode: "automatic" | "explicit";
} {
  const inWorkspace = (project: Project) =>
    !start.scope || project.dsh?.workspacePath === start.scope.workspacePath;
  const inSession = (project: Project) =>
    !start.scope ||
    (inWorkspace(project) && project.dsh?.sessionId === start.scope.sessionId);
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
  const explicit =
    stored.selectionMode === "explicit" &&
    restored &&
    (!restored.project.dsh || inWorkspace(restored.project));
  let active = explicit
    ? restored
    : restored &&
        inSession(restored.project) &&
        !isLegacyAutoDemo(restored.project)
      ? restored
      : undefined;
  if (!active && start.scope) {
    const candidate = [...server.values()]
      .filter((project) => {
        const local = records.get(project.id);
        return (
          inSession(project) &&
          !isLegacyAutoDemo(project) &&
          // Do not discard an unbound/foreign unsaved branch with the same ID.
          (!local?.dirty ||
            (inSession(local.project) && !isLegacyAutoDemo(local.project)))
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    if (candidate) {
      const local = records.get(candidate.id);
      active =
        local && inSession(local.project) && !isLegacyAutoDemo(local.project)
          ? local
          : {
              project: candidate,
              revision: candidate.updatedAt,
              dirty: false,
            };
    }
  }
  if (!active) {
    active = [...records.values()]
      .filter(
        (record) =>
          inSession(record.project) && !isLegacyAutoDemo(record.project),
      )
      .sort((a, b) =>
        b.project.updatedAt.localeCompare(a.project.updatedAt),
      )[0];
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
  return {
    active,
    records: [...records.values()],
    fresh,
    selectionMode: explicit ? "explicit" : "automatic",
  };
}
