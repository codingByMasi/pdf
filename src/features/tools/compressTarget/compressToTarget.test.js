// Tests for shrinking toward a target size.
import { describe, expect, it } from 'vitest';
import { compressToTarget, STEPS } from './compressToTarget.js';

const make = (n) => new Uint8Array(n);

describe('compressToTarget', () => {
  it('does nothing when already small enough', async () => {
    const result = await compressToTarget(make(100), 200, async () => { throw new Error('no'); });
    expect(result.met).toBe(true);
    expect(result.step).toBe(-1);
  });
  it('stops at the first step that fits', async () => {
    const sizes = [900, 500, 150, 100, 50];
    let calls = 0;
    const result = await compressToTarget(make(1000), 200, async () => make(sizes[calls++]));
    expect(result.met).toBe(true);
    expect(result.step).toBe(2);
    expect(calls).toBe(3);
  });
  it('returns the smallest when nothing fits', async () => {
    const result = await compressToTarget(make(1000), 10, async (step) => make(500 - STEPS.indexOf(step) * 10));
    expect(result.met).toBe(false);
    expect(result.bytes.length).toBe(460);
  });
  it('keeps the original if shrinking makes it bigger', async () => {
    const result = await compressToTarget(make(1000), 10, async () => make(2000));
    expect(result.bytes.length).toBe(1000);
    expect(result.step).toBe(-1);
  });
});
