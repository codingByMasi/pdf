// Tests for the age calculator.
import { describe, expect, it } from 'vitest';
import { calcAge } from './calcAge.js';

describe('calcAge', () => {
  it('gives years, months and days', () => {
    const r = calcAge('1990-05-15', '2024-03-10');
    expect(r).toMatchObject({ ok: true, years: 33, months: 9, days: 24, totalMonths: booleanNumber(r) });
  });
  it('counts to the next birthday', () => {
    expect(calcAge('1990-05-15', '2024-05-15')).toMatchObject({ daysToBirthday: 0, turning: 34 });
    expect(calcAge('1990-05-15', '2024-05-16')).toMatchObject({ daysToBirthday: 364, turning: 35 });
  });
  it('knows the weekday of birth', () => {
    expect(calcAge('2000-01-01', '2024-01-01').birthWeekday).toBe(6);
  });
  it('rejects bad or future dates', () => {
    expect(calcAge('2030-01-01', '2024-01-01').errorKey).toBe('age.future');
    expect(calcAge('x', '2024-01-01').errorKey).toBe('calc.badDate');
  });
});
function booleanNumber(r) { return r.years * 12 + r.months; }
