// Calendar sums: the weeks of a month, laid out as rows of 7 days (null for empty squares).
import { daysInMonth, weekday } from '../calcKit/dates.js';

// startDay: 0 = Sunday first, 1 = Monday first. Returns an array of weeks, each with 7 entries.
export function monthWeeks(year, month, startDay = 0) {
  const first = (weekday({ y: year, m: month, d: 1 }) - startDay + 7) % 7;
  const total = daysInMonth(year, month);
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// Day numbers in the order a week is shown: [0..6] for Sunday first, [1..6, 0] for Monday first.
export const dayOrder = (startDay) => Array.from({ length: 7 }, (_, i) => (i + startDay) % 7);
