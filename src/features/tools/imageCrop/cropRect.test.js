// Tests for turning crop boxes into pixels and margins.
import { describe, expect, it } from 'vitest';
import { marginsToRect, rectToMargins, rectToPixels } from './cropRect.js';

describe('crop boxes', () => {
  it('turns a box into pixels and keeps it inside the picture', () => {
    expect(rectToPixels({ x: 0.1, y: 0.2, w: 0.5, h: 0.5 }, 200, 100)).toEqual({ x: 20, y: 20, w: 100, h: 50 });
    expect(rectToPixels({ x: 0.9, y: 0.9, w: 0.5, h: 0.5 }, 100, 100)).toEqual({ x: 90, y: 90, w: 10, h: 10 });
  });
  it('goes between margins and boxes', () => {
    const rect = marginsToRect({ left: 10, top: 20, right: 30, bottom: 0 });
    expect(rect).toEqual({ x: 0.1, y: 0.2, w: 0.6, h: 0.8 });
    expect(rectToMargins(rect)).toEqual({ left: 10, top: 20, right: 30, bottom: 0 });
  });
  it('gives null when nothing is left', () => {
    expect(marginsToRect({ left: 60, right: 50 })).toBeNull();
  });
});
