// Tests how a tall picture is cut into pages.
import { describe, it, expect } from 'vitest';
import { planSlices } from './sliceImage.js';

describe('planSlices', () => {
  it('covers the whole picture without gaps', () => {
    const slices = planSlices(600, 5000);
    expect(slices[0].y).toBe(0);
    expect(slices.reduce((sum, s) => sum + s.height, 0)).toBe(5000);
    slices.slice(1).forEach((s, i) => expect(s.y).toBe(slices[i].y + slices[i].height));
  });
  it('makes one page for a short picture', () => {
    expect(planSlices(600, 300)).toHaveLength(1);
  });
  it('refuses a picture that needs too many pages', () => {
    expect(() => planSlices(100, 1_000_000)).toThrow();
  });
});
