// Tests for the line comparison.
import { describe, expect, it } from 'vitest';
import { diffLines } from './diffLines.js';

describe('diffLines', () => {
  it('finds added, removed and same lines', () => {
    const { lines } = diffLines('a\nb\nc', 'a\nc\nd');
    expect(lines.map((l) => l.type[0] + l.text)).toEqual(['sa', 'rb', 'sc', 'ad']);
  });
  it('says same for equal texts', () => {
    expect(diffLines('x', 'x').lines.every((l) => l.type === 'same')).toBe(true);
  });
  it('refuses huge input', () => {
    expect(diffLines('a\n'.repeat(4000), 'b').errorKey).toBe('diff.tooBig');
  });
});
