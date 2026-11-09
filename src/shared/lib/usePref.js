// Like useState, but remembers small option values (never files) on this device for next time.
import { useCallback, useState } from 'react';

const PREFIX = 'pref:';

function read(name, initial) {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    if (raw === null) return initial;
    const value = JSON.parse(raw);
    return typeof value === typeof initial ? value : initial;
  } catch {
    return initial;
  }
}

export function usePref(name, initial) {
  const [value, setValue] = useState(() => read(name, initial));
  const set = useCallback(
    (next) => {
      setValue(next);
      try {
        localStorage.setItem(PREFIX + name, JSON.stringify(next));
      } catch {
        // Storage blocked: the value is still used for this visit.
      }
    },
    [name],
  );
  return [value, set];
}

// Removes every remembered option.
export function clearPrefs() {
  try {
    Object.keys(localStorage).filter((key) => key.startsWith(PREFIX)).forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clear.
  }
}
