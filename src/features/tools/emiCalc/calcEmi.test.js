// Tests for the EMI calculator.
import { describe, expect, it } from 'vitest';
import { calcEmi } from './calcEmi.js';

describe('calcEmi', () => {
  it('matches a known loan', () => {
    const r = calcEmi(1000000, 10, 120);
    expect(r.emi).toBeCloseTo(13215.07, 1);
    expect(r.interest).toBeCloseTo(585808.4, 0);
  });
  it('works with no interest', () => expect(calcEmi(120000, 0, 12).emi).toBe(10000));
  it('ends with nothing left', () => {
    const r = calcEmi(500000, 8.5, 30);
    expect(r.years.at(-1).balance).toBeCloseTo(0, 4);
    expect(r.years).toHaveLength(3);
  });
  it('rejects nonsense', () => {
    expect(calcEmi(0, 5, 12).ok).toBe(false);
    expect(calcEmi(1000, 5, 5000).errorKey).toBe('emi.range');
  });
});
