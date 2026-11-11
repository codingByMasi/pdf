// Tests the barcode widths: every symbol is 11 wide, the check digit is right, and EAN-13 follows the rules.
import { describe, it, expect } from 'vitest';
import { code128, ean13, eanCheckDigit } from './code128.js';

describe('code128', () => {
  it('gives symbols that are 11 modules wide and ends with the stop bar', () => {
    const runs = code128('Hello 123');
    const total = runs.reduce((a, b) => a + b, 0);
    expect(total).toBe(11 * (1 + 9 + 1) + 13);
    expect(runs.slice(-7)).toEqual([2, 3, 3, 1, 1, 1, 2]);
  });
  it('uses the right check value', () => {
    // "PJJ123C" has the known check value 54 (Wikipedia example, set A); for set B the sum is computed the same way.
    const runs = code128('A');
    expect(runs.slice(0, 6)).toEqual([2, 1, 1, 2, 1, 4]);
    // start B 104 + 'A'(33)*1 = 137; 137 % 103 = 34 -> pattern 131123
    expect(runs.slice(12, 18)).toEqual([1, 3, 1, 1, 2, 3]);
  });
  it('refuses letters it cannot draw', () => {
    expect(() => code128('नमस्ते')).toThrow();
    expect(() => code128('')).toThrow();
  });
});

describe('ean13', () => {
  it('adds the check digit', () => {
    expect(eanCheckDigit('400638133393')).toBe(1);
    expect(ean13('400638133393').code).toBe('4006381333931');
  });
  it('is 95 modules wide', () => {
    expect(ean13('4006381333931').runs.reduce((a, b) => a + b, 0)).toBe(95);
  });
  it('rejects a wrong check digit', () => {
    expect(() => ean13('4006381333932')).toThrow();
    expect(() => ean13('123')).toThrow();
  });
});
