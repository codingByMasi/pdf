// Tests for fitting a picture under a wanted file size.
import { describe, expect, it } from 'vitest';
import { fitToSize } from './fitToSize.js';

// A pretend picture whose size is roughly scale squared times quality.
const fake = async (scale, quality) => ({ size: Math.round(100000 * scale * scale * quality) });

describe('fitToSize', () => {
  it('keeps full size when it already fits', async () => {
    const r = await fitToSize(fake, 200000);
    expect(r).toMatchObject({ met: true, scale: 1 });
  });
  it('lowers quality before size', async () => {
    const r = await fitToSize(fake, 60000);
    expect(r.met).toBe(true);
    expect(r.scale).toBe(1);
    expect(r.blob.size).toBeLessThanOrEqual(60000);
    expect(r.quality).toBeLessThan(0.95);
  });
  it('shrinks the picture when quality alone is not enough', async () => {
    const r = await fitToSize(fake, 10000);
    expect(r.met).toBe(true);
    expect(r.scale).toBeLessThan(1);
    expect(r.blob.size).toBeLessThanOrEqual(10000);
  });
  it('reports when it cannot fit', async () => {
    const r = await fitToSize(fake, 10);
    expect(r.met).toBe(false);
    expect(r.blob.size).toBeGreaterThan(10);
  });
});
