// Tests for the line tools.
import { describe, expect, it } from 'vitest';
import { runLineOp } from './lineOps.js';

describe('runLineOp', () => {
  it('removes repeated lines', () => expect(runLineOp('dedupe', 'a\nb\na')).toBe('a\nb'));
  it('sorts with numbers in order', () => expect(runLineOp('sortAz', 'item10\nitem2\nItem1')).toBe('Item1\nitem2\nitem10'));
  it('removes blank lines', () => expect(runLineOp('noBlank', 'a\n\n \nb')).toBe('a\nb'));
  it('numbers lines', () => expect(runLineOp('number', 'a\nb')).toBe('1. a\n2. b'));
  it('shuffles but keeps all lines', () => expect(runLineOp('shuffle', 'a\nb\nc\nd').split('\n').sort()).toEqual(['a', 'b', 'c', 'd']));
});
