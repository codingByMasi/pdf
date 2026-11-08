// Tests for searchTools.
import { describe, it, expect } from 'vitest';
import { searchTools } from './searchTools.js';

const list = [{ id: 'a', t: 'Merge PDF Join files' }, { id: 'b', t: 'Split PDF Cut pages' }, { id: 'c', t: 'PDF जोड़ें' }];
const textOf = (tool) => tool.t;

describe('searchTools', () => {
  it('returns everything for an empty search', () => {
    expect(searchTools(list, '   ', textOf)).toBe(list);
  });
  it('matches any letter case', () => {
    expect(searchTools(list, 'MERGE', textOf).map((x) => x.id)).toEqual(['a']);
  });
  it('needs every word to match', () => {
    expect(searchTools(list, 'pdf cut', textOf).map((x) => x.id)).toEqual(['b']);
    expect(searchTools(list, 'pdf nothing', textOf)).toEqual([]);
  });
  it('works with Hindi words', () => {
    expect(searchTools(list, 'जोड़ें', textOf).map((x) => x.id)).toEqual(['c']);
  });
});
