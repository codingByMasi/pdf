// Tests that paper becomes see-through, ink stays, and the ink box is found.
import { describe, it, expect } from 'vitest';
import { cleanSignature } from './cleanSignature.js';

function paperWithInk() {
  const w = 20, h = 10;
  const data = new Uint8ClampedArray(w * h * 4).fill(235);
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  for (let x = 5; x < 12; x += 1) { const i = (4 * w + x) * 4; data[i] = data[i + 1] = data[i + 2] = 30; }
  return { w, h, data };
}

describe('cleanSignature', () => {
  it('clears the paper and keeps the ink', () => {
    const { w, h, data } = paperWithInk();
    const box = cleanSignature(data, w, h, { tolerance: 40 });
    expect(data[3]).toBe(0);
    expect(data[(4 * w + 8) * 4 + 3]).toBeGreaterThan(200);
    expect(box).toEqual({ x: 5, y: 4, width: 7, height: 1 });
  });
  it('can paint the ink blue', () => {
    const { w, h, data } = paperWithInk();
    cleanSignature(data, w, h, { ink: 'blue' });
    const i = (4 * w + 8) * 4;
    expect([data[i], data[i + 1], data[i + 2]]).toEqual([20, 50, 160]);
  });
  it('gives null for a blank sheet', () => {
    const data = new Uint8ClampedArray(16 * 4).fill(240);
    expect(cleanSignature(data, 4, 4)).toBeNull();
  });
});
