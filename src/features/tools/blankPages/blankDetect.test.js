// Tests for blank page detection.
import { describe, expect, it } from 'vitest';
import { isBlankPixels } from './blankDetect.js';

const white = (n) => new Uint8ClampedArray(n * 4).fill(255);

describe('isBlankPixels', () => {
  it('sees a white page as blank', () => {
    expect(isBlankPixels(white(10000))).toBe(true);
  });
  it('sees a page with text as not blank', () => {
    const data = white(10000);
    for (let i = 0; i < 100 * 4; i += 1) data[i] = 0;
    expect(isBlankPixels(data)).toBe(false);
  });
  it('lets a few specks through on a loose setting', () => {
    const data = white(10000);
    for (let i = 0; i < 40; i += 1) data[i] = 0;
    expect(isBlankPixels(data, 'loose')).toBe(true);
    expect(isBlankPixels(data, 'careful')).toBe(false);
  });
});
