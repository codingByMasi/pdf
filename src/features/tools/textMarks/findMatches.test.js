// Tests for finding words on a page and working out their boxes.
import { describe, expect, it } from 'vitest';
import { findMatches } from './findMatches.js';

const measure = (s) => s.length;
const item = (str, e = 100, f = 700) => ({ str, transform: [12, 0, 0, 12, e, f], width: str.length * 6, height: 12 });

describe('findMatches', () => {
  it('finds every place a word appears, ignoring case', () => {
    const boxes = findMatches([item('Hello hello world')], 'hello', measure);
    expect(boxes).toHaveLength(2);
  });
  it('puts the box where the word is along the line', () => {
    const [box] = findMatches([item('ab cd')], 'cd', measure);
    expect(box.x).toBeCloseTo(100 + 3 * 6);
    expect(box.width).toBeCloseTo(12);
  });
  it('can match case', () => {
    expect(findMatches([item('Hello hello')], 'Hello', measure, { matchCase: true })).toHaveLength(1);
  });
  it('finds nothing for an empty search', () => {
    expect(findMatches([item('abc')], '  ', measure)).toEqual([]);
  });
  it('follows slanted text', () => {
    const slanted = { str: 'abcd', transform: [0, 12, -12, 0, 50, 50], width: 24, height: 12 };
    const [box] = findMatches([slanted], 'cd', measure);
    expect(box.angle).toBeCloseTo(90);
    expect(box.y).toBeCloseTo(50 + 12);
  });
});
