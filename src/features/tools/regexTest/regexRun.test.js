// Tests the regex runner on matches, groups, empty matches and wrong patterns.
import { describe, it, expect } from 'vitest';
import { runRegex } from './regexRun.js';

describe('runRegex', () => {
  it('finds every match with its place and groups', () => {
    const r = runRegex('(\\d+)-(\\d+)', '', 'a 10-20 b 3-4');
    expect(r.matches.map((m) => [m.index, m.text, m.groups])).toEqual([[2, '10-20', ['10', '20']], [10, '3-4', ['3', '4']]]);
  });
  it('supports flags and names', () => {
    const r = runRegex('(?<w>b+)', 'i', 'aBBc');
    expect(r.matches[0].named).toEqual({ w: 'BB' });
  });
  it('does not loop on empty matches', () => {
    expect(runRegex('x*', '', 'abc').matches).toHaveLength(4);
  });
  it('explains a wrong pattern', () => {
    expect(runRegex('(', '', 'a').ok).toBe(false);
  });
  it('stops at the limit', () => {
    const r = runRegex('a', '', 'a'.repeat(500), 10);
    expect(r.matches).toHaveLength(10);
    expect(r.more).toBe(true);
  });
});
