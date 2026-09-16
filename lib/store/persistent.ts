'use client';

import { useSyncExternalStore } from 'react';

/* ==========================================================================
   Persistent store
   localStorage is an external system, so it is read through
   useSyncExternalStore rather than an effect. That means:

   · the hydration render uses the server snapshot, so markup always matches
   · the stored value is adopted in one re-render, with no cascade
   · `hydrated` is part of the snapshot, so the interface can avoid showing a
     basket count or a saved area until it genuinely knows one

   Storage can throw (private mode, blocked site data). Every access is
   guarded and falls back to the default, which is always a usable state.
   ========================================================================== */

export interface Snapshot<T> {
  value: T;
  hydrated: boolean;
}

export interface PersistentStore<T> {
  subscribe: (listener: () => void) => () => void;
  get: () => Snapshot<T>;
  getServer: () => Snapshot<T>;
  set: (updater: T | ((previous: T) => T)) => void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  revive: (raw: unknown) => T | null = (raw) => raw as T,
): PersistentStore<T> {
  const serverSnapshot: Snapshot<T> = Object.freeze({ value: fallback, hydrated: false });
  let snapshot: Snapshot<T> | null = null;
  const listeners = new Set<() => void>();

  const read = (): Snapshot<T> => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const revived = revive(JSON.parse(raw));
        if (revived !== null) return { value: revived, hydrated: true };
      }
    } catch {
      /* Unavailable storage is not an error state — the default still works. */
    }
    return { value: fallback, hydrated: true };
  };

  const get = (): Snapshot<T> => {
    if (snapshot === null) snapshot = read();
    return snapshot;
  };

  const set: PersistentStore<T>['set'] = (updater) => {
    const previous = get().value;
    const next = typeof updater === 'function' ? (updater as (p: T) => T)(previous) : updater;
    if (Object.is(next, previous)) return;
    snapshot = { value: next, hydrated: true };
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* non-fatal */
    }
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get,
    getServer: () => serverSnapshot,
    set,
  };
}

export function usePersistent<T>(store: PersistentStore<T>): Snapshot<T> {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
