// Tests for the date difference tool.
import { describe, expect, it } from 'vitest';
import { diffDates, shiftDate } from './dateDiff.js';

describe('dateDiff', () => {
  it('measures the gap', () => {
    expect(diffDates('2024-01-01', '2024-03-01')).toMatchObject({ months: 2, days: 0, totalDays: 60, totalWeeks: 8, weeksRest: 4 });
  });
  it('swaps when the dates are the wrong way round', () => {
    expect(diffDates('2024-03-01', '2024-01-01')).toMatchObject({ reversed: true, totalDays: 60 });
  });
  it('adds and subtracts', () => {
    expect(shiftDate('2024-01-31', { months: 1 }).text).toBe('2024-02-29');
    expect(shiftDate('2024-03-01', { days: 1 }, -1).text).toBe('2024-02-29');
  });
  it('rejects bad dates', () => expect(diffDates('', '2024-01-01').ok).toBe(false));
});
