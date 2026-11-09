// Tests the line breaking used by Text to Image (no canvas needed).
import { describe, it, expect } from 'vitest';
import { wrapLines } from './renderTextImage.js';

const measure = (s) => s.length * 10;

describe('wrapLines', () => {
  it('breaks at spaces', () => {
    expect(wrapLines(measure, 'aaa bbb ccc', 70)).toEqual(['aaa bbb', 'ccc']);
  });
  it('keeps empty lines and line breaks', () => {
    expect(wrapLines(measure, 'a\n\nb', 100)).toEqual(['a', '', 'b']);
  });
  it('cuts a word that is longer than the line', () => {
    expect(wrapLines(measure, 'abcdefghij', 40)).toEqual(['abcd', 'efgh', 'ij']);
  });
});
