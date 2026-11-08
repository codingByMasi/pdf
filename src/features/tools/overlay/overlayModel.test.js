// Tests for moving and resizing things placed on a page.
import { describe, expect, it } from 'vitest';
import { boundsOf, makeBox, makeImage, makeLine, makePath, makeText, moveItem, moveWithin, resizeItem } from './overlayModel.js';

describe('overlayModel', () => {
  it('moves every kind of item', () => {
    expect(moveItem(makePath([[0, 0], [1, 1]], 'k', 0.01), 0.1, 0.2).points).toEqual([[0.1, 0.2], [1.1, 1.2]]);
    expect(moveItem(makeLine(0, 0, 1, 1, 'k', 0.01), 0.5, 0.5)).toMatchObject({ x1: 0.5, y2: 1.5 });
    expect(moveItem(makeBox('rect', 0.1, 0.1, 0.2, 0.2, {}), 0.1, 0)).toMatchObject({ x: 0.2, y: 0.1 });
  });

  it('keeps moved items on the page', () => {
    const box = makeBox('rect', 0.1, 0.1, 0.3, 0.2, {});
    const moved = moveWithin(box, 5, 5, 1.4);
    expect(moved.x).toBeCloseTo(0.7);
    expect(moved.y).toBeCloseTo(1.2);
    expect(moveWithin(box, -5, -5, 1.4)).toMatchObject({ x: 0, y: 0 });
  });

  it('measures text and keeps picture shape when resizing', () => {
    expect(boundsOf(makeText(0.1, 0.1, 'ab\nabcd', 0.05, 'k')).h).toBeCloseTo(0.13);
    const image = makeImage(0, 0, 0.2, 0.1, new Uint8Array(1), 'image/png', '');
    expect(resizeItem(image, 0.4, 0.5)).toMatchObject({ w: 0.4, h: 0.2 });
    expect(resizeItem(makeText(0, 0, 'a', 0.05, 'k'), 0.08).size).toBe(0.08);
  });
});
