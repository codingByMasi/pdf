// Difference between two dates, and a date plus or minus some days, months or years.
import { addToDate, formatDate, parseDate, toDays, ymdDiff } from '../calcKit/dates.js';

export function diffDates(fromText, toText) {
  const a = parseDate(fromText);
  const b = parseDate(toText);
  if (!a || !b) return { ok: false, errorKey: 'calc.badDate' };
  const reversed = toDays(a) > toDays(b);
  const [first, last] = reversed ? [b, a] : [a, b];
  const days = toDays(last) - toDays(first);
  return { ok: true, reversed, ...ymdDiff(first, last), totalDays: days, totalWeeks: Math.floor(days / 7), weeksRest: days % 7, inclusiveDays: days + 1 };
}

// sign: 1 to add, -1 to subtract.
export function shiftDate(text, { years = 0, months = 0, days = 0 }, sign = 1) {
  const date = parseDate(text);
  if (!date) return { ok: false, errorKey: 'calc.badDate' };
  const clean = (n) => Math.max(0, Math.min(100000, Math.floor(Number(n) || 0))) * sign;
  return { ok: true, text: formatDate(addToDate(date, { years: clean(years), months: clean(months), days: clean(days) })) };
}
