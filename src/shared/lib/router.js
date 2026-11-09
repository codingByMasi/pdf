// Tiny page router: reads the address bar and changes pages without reloading. Hindi pages live under /hi.
import { useSyncExternalStore } from 'react';

const listeners = new Set();
const HINDI = '/hi';

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener('popstate', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('popstate', callback);
  };
}

// Splits an address into its language and the page path: "/hi/merge-pdf" gives { lang: 'hi', path: '/merge-pdf' }.
export function splitPath(raw) {
  const clean = raw.replace(/\/+$/, '') || '/';
  if (clean === HINDI || clean.startsWith(`${HINDI}/`)) return { lang: 'hi', path: clean.slice(HINDI.length) || '/' };
  return { lang: 'en', path: clean };
}

// Gives the real address of a page path in a language: ("hi", "/") becomes "/hi".
export function localize(lang, path) {
  if (lang !== 'hi') return path;
  return path === '/' ? HINDI : `${HINDI}${path}`;
}

const rawPath = () => window.location.pathname;
const currentPath = () => splitPath(rawPath()).path;

// raw: the real address (already with /hi when needed).
export function navigate(raw) {
  if (raw === rawPath()) return;
  window.history.pushState({}, '', raw);
  listeners.forEach((callback) => callback());
  window.scrollTo(0, 0);
}

// Changes the address to another language without adding a history entry.
export function switchAddressLanguage(lang) {
  const next = localize(lang, currentPath());
  if (next !== rawPath()) window.history.replaceState({}, '', next + window.location.search + window.location.hash);
}

export const languageFromAddress = () => splitPath(rawPath()).lang;

export function useRoute() {
  return useSyncExternalStore(subscribe, currentPath, () => '/');
}
