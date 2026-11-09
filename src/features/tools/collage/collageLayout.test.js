// Tests for the collage layout maths.
import { describe, expect, it } from 'vitest';
import { collageLayout, coverBox } from './collageLayout.js';

describe('collageLayout', () => {
  it('puts pictures in one row', () => {
    const l = collageLayout('row', 3, 10);
    expect(l.cells.map((c) => c.y)).toEqual([10, 10, 10]);
    expect(l.width).toBe(10 + 3 * 810);
    expect(l.height).toBe(820);
  });
  it('puts pictures in a column', () => {
    const l = collageLayout('column', 2, 0);
    expect(l.cells.map((c) => c.x)).toEqual([0, 0]);
    expect(l.height).toBe(1600);
  });
  it('wraps a grid of 2', () => {
    const l = collageLayout('grid2', 5, 0);
    expect(l.cells[4]).toMatchObject({ x: 0, y: 1600 });
    expect(l.height).toBe(2400);
  });
  it('shrinks the grid for few pictures', () => {
    expect(collageLayout('grid3', 2, 0).width).toBe(1600);
  });
});

describe('coverBox', () => {
  it('crops the sides of a wide picture', () => {
    expect(coverBox(2000, 1000, 100, 100)).toEqual({ sx: 500, sy: 0, sw: 1000, sh: 1000 });
  });
});
