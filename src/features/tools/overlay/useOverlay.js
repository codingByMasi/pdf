// Keeps everything placed on each page, with undo. Items are grouped by page number (starting at 0).
import { useCallback, useState } from 'react';

const MAX_HISTORY = 60;

export function useOverlay() {
  const [state, setState] = useState({ past: [], now: {} });

  const change = useCallback((make, remember = true) => {
    setState((s) => {
      const now = make(s.now);
      if (now === s.now) return s;
      return { past: remember ? [...s.past.slice(-MAX_HISTORY), s.now] : s.past, now };
    });
  }, []);

  const add = useCallback((page, item) => change((now) => ({ ...now, [page]: [...(now[page] ?? []), item] })), [change]);
  const update = useCallback(
    (page, id, patch, remember = true) =>
      change((now) => ({ ...now, [page]: (now[page] ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item)) }), remember),
    [change],
  );
  const replace = useCallback(
    (page, id, item, remember = false) =>
      change((now) => ({ ...now, [page]: (now[page] ?? []).map((old) => (old.id === id ? item : old)) }), remember),
    [change],
  );
  const remove = useCallback(
    (page, id) => change((now) => ({ ...now, [page]: (now[page] ?? []).filter((item) => item.id !== id) })),
    [change],
  );
  const clearPage = useCallback((page) => change((now) => (now[page]?.length ? { ...now, [page]: [] } : now)), [change]);
  // Saves a step to go back to, before something like a drag starts changing items without history.
  const mark = useCallback(() => setState((s) => ({ past: [...s.past.slice(-MAX_HISTORY), s.now], now: s.now })), []);
  const undo = useCallback(
    () => setState((s) => (s.past.length ? { past: s.past.slice(0, -1), now: s.past.at(-1) } : s)),
    [],
  );

  const total = Object.values(state.now).reduce((sum, list) => sum + list.length, 0);
  return { byPage: state.now, total, canUndo: state.past.length > 0, add, update, replace, remove, clearPage, mark, undo };
}
