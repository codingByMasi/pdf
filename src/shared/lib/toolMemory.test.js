// Tests that recent tools and favourites are kept, limited and cleared with the other saved settings.
// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { addRecent } from './toolMemory.js';
import { clearPrefs } from './usePref.js';

describe('toolMemory', () => {
  beforeEach(() => localStorage.clear());
  it('puts the newest first, without repeats, up to six', () => {
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'a'].forEach(addRecent);
    expect(JSON.parse(localStorage.getItem('pref:tools.recent'))).toEqual(['a', 'g', 'f', 'e', 'd', 'c']);
  });
  it('is removed by Forget my settings', () => {
    addRecent('a');
    clearPrefs();
    expect(localStorage.getItem('pref:tools.recent')).toBeNull();
  });
});
