// Tests for outputName.
import { describe, it, expect } from 'vitest';
import { outputName } from './outputName.js';

describe('outputName', () => {
  it('adds a suffix and keeps the name', () => {
    expect(outputName('My Report.pdf', '-edited')).toBe('My Report-edited.pdf');
  });
  it('removes unsafe characters', () => {
    expect(outputName('a/b\\c<>:"|?*.pdf', '-x')).toBe('abc-x.pdf');
  });
  it('keeps Hindi letters and works with no name', () => {
    expect(outputName('रिपोर्ट.pdf', '-x')).toBe('रिपोर्ट-x.pdf');
    expect(outputName('.pdf', '-x', 'zip')).toBe('file-x.zip');
  });
});
