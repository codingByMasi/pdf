// Tests moving an item in a list.
import { describe, it, expect } from 'vitest';
import { reorder } from './reorder.js';

describe('reorder', () => {
  it('moves forward and backward', () => {
    expect(reorder(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(reorder(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });
  it('leaves the list alone for bad places', () => {
    const list = ['a', 'b'];
    expect(reorder(list, 0, 5)).toBe(list);
    expect(reorder(list, 1, 1)).toBe(list);
  });
});
