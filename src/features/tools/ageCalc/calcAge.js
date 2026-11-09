// Works out an age from a birth date: years, months, days, total days and the next birthday.
import { addToDate, parseDate, toDays, weekday, ymdDiff } from '../calcKit/dates.js';

// Returns { ok, ... } or { ok: false, errorKey }.
export function calcAge(birthText, asOfText) {
  const birth = parseDate(birthText);
  const asOf = parseDate(asOfText);
  if (!birth || !asOf) return { ok: false, errorKey: 'calc.badDate' };
  if (toDays(birth) > toDays(asOf)) return { ok: false, errorKey: 'age.future' };
  const age = ymdDiff(birth, asOf);
  let next = { y: asOf.y, m: birth.m, d: birth.m === 2 && birth.d === 29 && !leap(asOf.y) ? 28 : birth.d };
  if (toDays(next) < toDays(asOf)) {
    const y = asOf.y + 1;
    next = { y, m: birth.m, d: birth.m === 2 && birth.d === 29 && !leap(y) ? 28 : birth.d };
  }
  const days = toDays(asOf) - toDays(birth);
  return { ok: true, ...age, totalDays: days, totalWeeks: Math.floor(days / 7), totalMonths: age.years * 12 + age.months, daysToBirthday: toDays(next) - toDays(asOf), birthWeekday: weekday(birth), nextBirthday: next, turning: next.y - birth.y, addToDate };
}
const leap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
