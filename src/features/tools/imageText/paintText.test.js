// Tests for where picture text is placed.
import { describe, expect, it } from 'vitest';
import { SPOTS, spotPlace } from './paintText.js';

describe('spotPlace', () => {
  it('puts the bottom right text in the corner', () => {
    expect(spotPlace('br', 1000, 500, 10)).toEqual({ x: 990, y: 490, align: 'right', baseline: 'bottom' });
  });
  it('centres the middle spot', () => {
    expect(spotPlace('mc', 1000, 500, 10)).toEqual({ x: 500, y: 250, align: 'center', baseline: 'middle' });
  });
  it('lists nine spots and tile', () => {
    expect(SPOTS).toHaveLength(10);
  });
});
