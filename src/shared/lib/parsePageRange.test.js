// Tests for parsePageRange.
import { describe, it, expect } from 'vitest';
import { parsePageRange } from './parsePageRange.js';

describe('parsePageRange', () => {
  it('reads ranges and single pages', () => {
    expect(parsePageRange('1-3, 5', 10).indices).toEqual([0, 1, 2, 4]);
    expect(parsePageRange(' 7 ', 10).indices).toEqual([6]);
  });
  it('removes repeats and sorts', () => {
    expect(parsePageRange('5,1-2,2', 10).indices).toEqual([0, 1, 4]);
  });
  it('reports empty text', () => {
    expect(parsePageRange('  ', 10).errorKey).toBe('error.rangeEmpty');
  });
  it('reports bad text', () => {
    for (const bad of ['a', '1-', '-3', '3-1', '0', '1,,2', '1-2-3']) {
      expect(parsePageRange(bad, 10).errorKey, bad).toBe('error.rangeBad');
    }
  });
  it('reports pages past the end', () => {
    const result = parsePageRange('2-11', 10);
    expect(result.errorKey).toBe('error.rangeOutside');
    expect(result.vars).toEqual({ count: 10 });
  });
});
