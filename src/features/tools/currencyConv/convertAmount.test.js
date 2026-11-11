// Tests the typed-rate conversion.
import { describe, it, expect } from 'vitest';
import { convertAmount } from './convertAmount.js';

describe('convertAmount', () => {
  it('multiplies by the rate and gives the back rate', () => {
    const r = convertAmount('100', '83.5');
    expect(r.value).toBe(8350);
    expect(r.text).toBe('8,350');
    expect(r.back).toBe('0.011976');
  });
  it('refuses a zero or missing rate', () => {
    expect(convertAmount('5', '0').ok).toBe(false);
    expect(convertAmount('x', '2').ok).toBe(false);
  });
});
