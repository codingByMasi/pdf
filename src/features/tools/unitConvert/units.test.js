// Tests for the unit converter.
import { describe, expect, it } from 'vitest';
import { GROUPS, convertUnit, niceNumber } from './units.js';

describe('convertUnit', () => {
  it('converts length', () => expect(convertUnit('length', 'km', 'mile', '10')).toBeCloseTo(6.2137, 3));
  it('converts weight', () => expect(convertUnit('weight', 'quintal', 'kg', '2')).toBe(200));
  it('converts area', () => expect(convertUnit('area', 'acre', 'sqft', '1')).toBeCloseTo(43560, 0));
  it('converts temperature', () => {
    expect(convertUnit('temperature', 'c', 'f', '100')).toBe(212);
    expect(convertUnit('temperature', 'f', 'c', '32')).toBe(0);
    expect(convertUnit('temperature', 'c', 'k', '0')).toBeCloseTo(273.15, 6);
  });
  it('returns nothing for empty input', () => expect(convertUnit('length', 'm', 'km', '')).toBeNull());
  it('has every group', () => expect(Object.keys(GROUPS)).toHaveLength(7));
  it('writes numbers plainly', () => {
    expect(niceNumber(0.1 + 0.2)).toBe('0.3');
    expect(niceNumber(1234567.891)).toBe('1234567.891');
  });
});
