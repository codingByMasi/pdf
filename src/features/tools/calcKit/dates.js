// Small date helpers that work with "YYYY-MM-DD" text and never depend on the time zone.
export function parseDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text).trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const back = new Date(Date.UTC(y, mo - 1, d));
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}
export const toDays = ({ y, m, d }) => Math.round(Date.UTC(y, m - 1, d) / 86400000);
export const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const weekday = (date) => new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay();
export const formatDate = ({ y, m, d }) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export function todayText(now = new Date()) {
  return formatDate({ y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() });
}

// Adds years, months and days to a date (months first, the day is cut back to the month's end).
export function addToDate(date, { years = 0, months = 0, days = 0 }) {
  const total = date.y * 12 + (date.m - 1) + years * 12 + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  const base = { y, m, d: Math.min(date.d, daysInMonth(y, m)) };
  const moved = new Date(Date.UTC(base.y, base.m - 1, base.d + days));
  return { y: moved.getUTCFullYear(), m: moved.getUTCMonth() + 1, d: moved.getUTCDate() };
}

// Years, months and days from a to b (a must not be after b). Whole months first, then the days left over.
export function ymdDiff(a, b) {
  let months = (b.y - a.y) * 12 + (b.m - a.m);
  if (toDays(addToDate(a, { months })) > toDays(b)) months -= 1;
  const days = toDays(b) - toDays(addToDate(a, { months }));
  return { years: Math.floor(months / 12), months: months % 12, days };
}
