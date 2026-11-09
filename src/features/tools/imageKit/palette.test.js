// Tests for colour text and finding the main colours of a picture.
import { describe, expect, it } from 'vitest';
import { dominantColours, toHex, toHsl } from './palette.js';

describe('colour text', () => {
  it('makes hex and hsl', () => {
    expect(toHex([255, 128, 0])).toBe('#ff8000');
    expect(toHsl([255, 0, 0])).toEqual([0, 100, 50]);
    expect(toHsl([255, 255, 255])).toEqual([0, 0, 100]);
  });
});

describe('dominantColours', () => {
  it('lists the most common colour first and skips near twins', () => {
    const data = new Uint8ClampedArray(4 * 100);
    for (let i = 0; i < 100; i += 1) {
      const red = i < 60;
      data.set(red ? [250, 10, 10, 255] : [10, 10, 250, 255], i * 4);
    }
    data.set([255, 12, 12, 255], 0);
    const colours = dominantColours(data, 3);
    expect(colours).toHaveLength(2);
    expect(colours[0][0]).toBeGreaterThan(200);
    expect(colours[1][2]).toBeGreaterThan(200);
  });
  it('ignores see-through pixels', () => {
    expect(dominantColours(new Uint8ClampedArray([255, 0, 0, 0]), 3)).toEqual([]);
  });
});
