// Tests for the scanner's document look filters.
import { describe, expect, it } from 'vitest';
import { filterPixels } from './scanPages.js';

const pixels = (...values) => new Uint8ClampedArray(values.flatMap((v) => [v, v, v, 255]));

describe('filterPixels', () => {
  it('leaves colour alone and makes grey from colour', () => {
    const colour = new Uint8ClampedArray([255, 0, 0, 255]);
    expect(Array.from(filterPixels(colour.slice(), 'color'))).toEqual([255, 0, 0, 255]);
    const grey = filterPixels(colour.slice(), 'gray');
    expect(grey[0]).toBe(grey[1]);
    expect(grey[1]).toBe(grey[2]);
  });

  it('turns dull grey paper white and keeps dark writing dark', () => {
    const paper = Array.from({ length: 80 }, () => 190);
    const ink = Array.from({ length: 5 }, () => 40);
    const out = filterPixels(pixels(...paper, ...ink), 'bw');
    expect(out[0]).toBeGreaterThan(240);
    expect(out[80 * 4]).toBeLessThan(30);
  });
});
