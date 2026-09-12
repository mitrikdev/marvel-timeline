'use client';

import { useSyncExternalStore } from 'react';
import { movies } from '@/data';
import { parseWatchHistory, serializeWatchHistory, WATCH_HISTORY_KEY } from '@/lib/watch-history';

type Snapshot = { watchedIds: string[]; storageAvailable: boolean; ready: boolean };
const emptySnapshot: Snapshot = { watchedIds: [], storageAvailable: true, ready: false };
const validIds = new Set(movies.map((movie) => movie.id));
let snapshot = emptySnapshot;
let initialized = false;
const listeners = new Set<() => void>();
function notify() {
  for (const listener of listeners) listener();
}
function readStorage() {
  try {
    snapshot = {
      watchedIds: parseWatchHistory(window.localStorage.getItem(WATCH_HISTORY_KEY), validIds),
      storageAvailable: true,
      ready: true,
    };
  } catch {
    snapshot = { ...snapshot, storageAvailable: false, ready: true };
  }
}
function onStorage(event: StorageEvent) {
  if (event.key === WATCH_HISTORY_KEY || event.key === null) {
    readStorage();
    notify();
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener('storage', onStorage);
    readStorage();
    initialized = true;
    notify();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}
function toggleWatched(id: string) {
  if (!validIds.has(id)) return;
  if (!initialized) {
    readStorage();
    initialized = true;
  }
  const next = snapshot.watchedIds.includes(id)
    ? snapshot.watchedIds.filter((value) => value !== id)
    : [...snapshot.watchedIds, id].sort();
  let storageAvailable = true;
  try {
    window.localStorage.setItem(WATCH_HISTORY_KEY, serializeWatchHistory(next));
  } catch {
    storageAvailable = false;
  }
  snapshot = { watchedIds: next, storageAvailable, ready: true };
  notify();
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => emptySnapshot;
export function useWatchHistory() {
  return { ...useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), toggleWatched };
}
