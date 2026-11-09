// Tests remembered options with a simple fake storage.
// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from './renderHookLite.js';
import { clearPrefs, usePref } from './usePref.js';

describe('usePref', () => {
  beforeEach(() => localStorage.clear());
  it('starts with the first value, then remembers the new one', () => {
    const first = renderHook(() => usePref('x', 'a'));
    expect(first.result()[0]).toBe('a');
    act(() => first.result()[1]('b'));
    first.unmount();
    expect(renderHook(() => usePref('x', 'a')).result()[0]).toBe('b');
  });
  it('ignores a saved value of the wrong kind and clears on request', () => {
    localStorage.setItem('pref:n', JSON.stringify('text'));
    expect(renderHook(() => usePref('n', 5)).result()[0]).toBe(5);
    localStorage.setItem('pref:k', '1');
    clearPrefs();
    expect(localStorage.getItem('pref:k')).toBe(null);
  });
});
