// Tests for page placement on turned pages.
import { describe, it, expect } from 'vitest';
import { displaySize, displayToPage } from './pagePlacement.js';

const page = { width: 200, height: 100 };

describe('pagePlacement', () => {
  it('swaps the size for sideways pages', () => {
    expect(displaySize(200, 100, 90)).toEqual({ width: 100, height: 200 });
    expect(displaySize(200, 100, 180)).toEqual({ width: 200, height: 100 });
  });
  it('leaves an upright page alone', () => {
    expect(displayToPage({ x: 10, y: 20 }, { ...page, rotation: 0 })).toEqual({ x: 10, y: 20 });
  });
  it('maps the bottom-left corner you see to the right corner of the file', () => {
    // After a 90 degree turn the seen bottom-left is the file's top-left.
    expect(displayToPage({ x: 0, y: 0 }, { ...page, rotation: 90 })).toEqual({ x: 200, y: 0 });
    expect(displayToPage({ x: 0, y: 0 }, { ...page, rotation: 180 })).toEqual({ x: 200, y: 100 });
    expect(displayToPage({ x: 0, y: 0 }, { ...page, rotation: 270 })).toEqual({ x: 0, y: 100 });
  });
});
