// Tests the word and page comparison.
import { describe, it, expect } from 'vitest';
import { comparePages, diffWords } from './diffWords.js';

describe('diffWords', () => {
  it('finds added and removed words', () => {
    expect(diffWords('the cat sat', 'the dog sat down')).toEqual({ added: ['dog', 'down'], removed: ['cat'] });
  });
  it('finds nothing when the text is the same', () => {
    expect(diffWords('a b c', 'a  b\nc')).toEqual({ added: [], removed: [] });
  });
  it('works for Hindi', () => {
    expect(diffWords('नमस्ते दुनिया', 'नमस्ते भारत').added).toEqual(['भारत']);
  });
  it('still answers for very long pages', () => {
    const long = Array.from({ length: 2000 }, (_, i) => `w${i}`).join(' ');
    expect(diffWords(long, `${long} extra`).added).toEqual(['extra']);
  });
});

describe('comparePages', () => {
  it('lists only changed pages and pages that exist in one file', () => {
    const changes = comparePages(['a b', 'c d', 'e'], ['a b', 'c x']);
    expect(changes.map((c) => c.page)).toEqual([2, 3]);
    expect(changes[1].onlyIn).toBe('first');
  });
});
