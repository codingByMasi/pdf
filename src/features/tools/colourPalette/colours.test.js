// Tests colour conversion, matching colours and the gradient line.
import { describe, it, expect } from 'vitest';
import { gradientCss, hexToHsl, hslToHex, makePalettes } from './colours.js';

describe('colours', () => {
  it('goes between hex and HSL', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
    expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00');
    expect(hslToHex(hexToHsl('#ff8000'))).toBe('#ff8000');
    expect(hexToHsl('nope')).toBeNull();
  });
  it('finds the opposite colour and three-colour sets', () => {
    const p = makePalettes('#ff0000');
    expect(p.complementary[1]).toBe('#00ffff');
    expect(p.triadic).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    expect(p.shades).toHaveLength(6);
  });
  it('writes the gradient', () => {
    expect(gradientCss(90.4, ['#fff', '#000'])).toBe('background: linear-gradient(90deg, #fff, #000);');
  });
});
