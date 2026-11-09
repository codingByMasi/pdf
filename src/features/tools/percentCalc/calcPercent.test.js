// Tests for the percentage calculator.
import { describe, expect, it } from 'vitest';
import { calcPercent, tidy } from './calcPercent.js';

describe('calcPercent', () => {
  it('finds a percent of a number', () => expect(calcPercent('of', '15', '200').value).toBe(30));
  it('finds what percent', () => expect(calcPercent('whatPercent', '50', '200').value).toBe(25));
  it('finds the change', () => {
    expect(calcPercent('change', '80', '100').value).toBe(25);
    expect(calcPercent('change', '100', '80').value).toBe(-20);
  });
  it('adds and cuts', () => {
    const r = calcPercent('plusMinus', '10', '200');
    expect(r.value).toBeCloseTo(220, 6);
    expect(r.minus).toBeCloseTo(180, 6);
  });
  it('does not divide by zero', () => {
    expect(calcPercent('whatPercent', '5', '0').errorKey).toBe('pct.zero');
    expect(calcPercent('of', '', '5').ok).toBe(false);
  });
  it('tidies numbers', () => expect(tidy(1 / 3)).toBe('0.333333'));
});
