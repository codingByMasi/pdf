// Tests for the date helpers.
import { describe, expect, it } from 'vitest';
import { addToDate, parseDate, toDays, ymdDiff } from './dates.js';

describe('dates', () => {
  it('rejects impossible dates', () => {
    expect(parseDate('2023-02-30')).toBeNull();
    expect(parseDate('hello')).toBeNull();
    expect(parseDate('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
  });
  it('counts days between dates', () => {
    expect(toDays(parseDate('2024-03-01')) - toDays(parseDate('2024-02-01'))).toBe(29);
  });
  it('works out years, months and days', () => {
    expect(ymdDiff(parseDate('1990-05-15'), parseDate('2024-03-10'))).toEqual({ years: 33, months: 9, days: 24 });
    expect(ymdDiff(parseDate('2024-01-31'), parseDate('2024-03-01'))).toEqual({ years: 0, months: 1, days: 1 });
  });
  it('adds to a date and cuts to month end', () => {
    expect(addToDate(parseDate('2024-01-31'), { months: 1 })).toEqual({ y: 2024, m: 2, d: 29 });
    expect(addToDate(parseDate('2024-12-25'), { days: 10 })).toEqual({ y: 2025, m: 1, d: 4 });
    expect(addToDate(parseDate('2024-03-10'), { days: -10 })).toEqual({ y: 2024, m: 2, d: 29 });
  });
});
