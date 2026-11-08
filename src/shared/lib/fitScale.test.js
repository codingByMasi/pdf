// Tests for fitScale.
import { describe, it, expect } from 'vitest';
import { fitScale } from './fitScale.js';

describe('fitScale', () => {
  it('keeps the wanted scale for normal pages', () => {
    expect(fitScale(595, 842, 2)).toBe(2);
  });
  it('shrinks the scale for huge pages', () => {
    const scale = fitScale(5000, 7000, 2);
    expect(5000 * scale).toBeLessThanOrEqual(4096);
    expect(7000 * scale).toBeLessThanOrEqual(4096);
    expect(5000 * scale * 7000 * scale).toBeLessThanOrEqual(16_000_001);
  });
});
