// Remembers the visitor's light or dark choice (kept on this device only). No choice means "follow the device".
const KEY = 'theme';

function read() {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function applyStoredTheme() {
  const stored = read();
  if (stored) document.documentElement.dataset.theme = stored;
}

// Returns 'light' or 'dark': the stored choice, or what the device prefers.
export function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private browsing: the choice just lasts until the page closes.
  }
}
