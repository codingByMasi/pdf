// Tests that inverting flips colours and keeps transparency.
import { describe, it, expect } from 'vitest';
import { invertInPlace } from './invertPixels.js';

describe('invertInPlace', () => {
  it('turns white into black and keeps the alpha', () => {
    expect([...invertInPlace(new Uint8ClampedArray([255, 255, 255, 200]))]).toEqual([0, 0, 0, 200]);
  });
  it('flips each colour channel', () => {
    expect([...invertInPlace(new Uint8ClampedArray([10, 100, 250, 255]))]).toEqual([245, 155, 5, 255]);
  });
});
