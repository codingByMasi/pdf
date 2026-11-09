// Tiny helper for tests: runs a React hook inside a hidden component and lets the test read its latest value.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export function renderHook(hook) {
  let latest;
  function Probe() {
    latest = hook();
    return null;
  }
  const root = createRoot(document.createElement('div'));
  act(() => root.render(createElement(Probe)));
  return { result: () => latest, unmount: () => act(() => root.unmount()) };
}

export { act };
