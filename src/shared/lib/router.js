// Tiny page router: reads the address bar and changes pages without reloading.
import { useSyncExternalStore } from 'react';

const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener('popstate', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('popstate', callback);
  };
}

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function navigate(path) {
  if (path === currentPath()) return;
  window.history.pushState({}, '', path);
  listeners.forEach((callback) => callback());
  window.scrollTo(0, 0);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, currentPath, () => '/');
}
