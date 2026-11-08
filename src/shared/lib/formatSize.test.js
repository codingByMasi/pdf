// Tests for formatSize.
import { describe, it, expect } from 'vitest';
import { formatSize } from './formatSize.js';

describe('formatSize', () => {
  it('formats bytes, KB and MB', () => {
    expect(formatSize(500)).toBe('500 B');
    expect(formatSize(2048)).toBe('2 KB');
    expect(formatSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
  it('returns empty text for bad input', () => {
    expect(formatSize(-1)).toBe('');
    expect(formatSize(NaN)).toBe('');
  });
});
