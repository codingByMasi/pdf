// Tests for the calendar layout maths.
import { describe, expect, it } from 'vitest';
import { dayOrder, monthWeeks } from './calendarMath.js';

describe('monthWeeks', () => {
  it('puts 1 March 2024 (a Friday) in the right square with Sunday first', () => {
    const weeks = monthWeeks(2024, 3, 0);
    expect(weeks[0]).toEqual([null, null, null, null, null, 1, 2]);
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
  });
  it('shifts for Monday first', () => {
    expect(monthWeeks(2024, 3, 1)[0]).toEqual([null, null, null, null, 1, 2, 3]);
  });
  it('knows February in a leap year', () => {
    expect(monthWeeks(2024, 2, 1).flat().filter(Boolean)).toHaveLength(29);
    expect(monthWeeks(2023, 2, 1).flat().filter(Boolean)).toHaveLength(28);
  });
  it('orders the days', () => {
    expect(dayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });
});
