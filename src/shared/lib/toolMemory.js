// Remembers, on this device only, which tools were used lately and which are favourites. No tool names ever leave the device.
import { useCallback, useMemo, useSyncExternalStore } from 'react';

const RECENT = 'pref:tools.recent';
const FAV = 'pref:tools.fav';
const EVENT = 'toolmemory';
const MAX_RECENT = 6;
const MAX_FAV = 24;

function raw(key) {
  try {
    return localStorage.getItem(key) ?? '[]';
  } catch {
    return '[]';
  }
}

function parse(text) {
  try {
    const list = JSON.parse(text);
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage blocked: nothing is remembered, and that is fine.
  }
  window.dispatchEvent(new Event(EVENT));
}

export const addRecent = (id) => write(RECENT, [id, ...parse(raw(RECENT)).filter((x) => x !== id)].slice(0, MAX_RECENT));

function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function useToolMemory() {
  const recentText = useSyncExternalStore(subscribe, () => raw(RECENT), () => '[]');
  const favText = useSyncExternalStore(subscribe, () => raw(FAV), () => '[]');
  const recent = useMemo(() => parse(recentText), [recentText]);
  const favourites = useMemo(() => parse(favText), [favText]);
  const toggleFavourite = useCallback((id) => {
    const list = parse(raw(FAV));
    write(FAV, list.includes(id) ? list.filter((x) => x !== id) : [id, ...list].slice(0, MAX_FAV));
  }, []);
  return { recent, favourites, toggleFavourite };
}
