// Tests for removing a plain background colour from a picture.
import { describe, expect, it } from 'vitest';
import { removeColour } from './removeColour.js';

// 5 x 5 picture: white everywhere, a red ring in the middle with a white hole inside.
function ringPicture() {
  const data = new Uint8ClampedArray(5 * 5 * 4);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const i = (y * 5 + x) * 4;
      const ring = x >= 1 && x <= 3 && y >= 1 && y <= 3 && !(x === 2 && y === 2);
      data.set(ring ? [220, 20, 20, 255] : [255, 255, 255, 255], i);
    }
  }
  return data;
}
const alpha = (data, x, y) => data[(y * 5 + x) * 4 + 3];

describe('removeColour', () => {
  it('clears the outside but keeps a white hole surrounded by the object', () => {
    const data = removeColour(ringPicture(), 5, 5, { colour: [255, 255, 255], tolerance: 30, edgeOnly: true });
    expect(alpha(data, 0, 0)).toBe(0);
    expect(alpha(data, 1, 1)).toBe(255);
    expect(alpha(data, 2, 2)).toBe(255);
  });
  it('clears the hole too when edge only is off', () => {
    const data = removeColour(ringPicture(), 5, 5, { colour: [255, 255, 255], tolerance: 30, edgeOnly: false });
    expect(alpha(data, 2, 2)).toBe(0);
    expect(alpha(data, 1, 1)).toBe(255);
  });
  it('does nothing when no pixel is close to the colour', () => {
    const data = removeColour(ringPicture(), 5, 5, { colour: [0, 0, 255], tolerance: 10, edgeOnly: true });
    expect(alpha(data, 0, 0)).toBe(255);
  });
});
