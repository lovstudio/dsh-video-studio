/** DSH seeds this stable baseline module; npm's older package omits the current declarations. */
declare module "@deepseek-ai/dsh-client-store" {
  export interface SnapshotStore<T> {
    getSnapshot(): T;
    subscribe(listener: () => void): () => void;
    update(mutator: (state: T) => void): void;
    set(state: T): void;
  }
  export function createSnapshotStore<T>(initial: T): SnapshotStore<T>;
}
