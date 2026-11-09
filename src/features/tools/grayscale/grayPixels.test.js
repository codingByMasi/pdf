// Tests for turning pixels grey or black and white.
import { describe, expect, it } from 'vitest';
import { grayInPlace } from './grayPixels.js';

describe('grayInPlace', () => {
  it('makes the three colour values equal', () => {
    const [r, g, b] = grayInPlace(new Uint8ClampedArray([200, 100, 50, 255]));
    expect(r).toBe(g);
    expect(g).toBe(b);
  });
  it('makes pure black or white with a threshold', () => {
    const data = grayInPlace(new Uint8ClampedArray([250, 250, 250, 255, 10, 10, 10, 255]), 128);
    expect(Array.from(data)).toEqual([255, 255, 255, 255, 0, 0, 0, 255]);
  });
});
