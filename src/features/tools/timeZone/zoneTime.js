// Time zone maths with the browser's own Intl data (no internet, no library).
export const ZONES = ['Asia/Kolkata', 'UTC', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Singapore', 'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Sao_Paulo', 'Africa/Johannesburg', 'Africa/Lagos'];

function parts(ms, zone) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return Object.fromEntries(f.formatToParts(new Date(ms)).filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)]));
}

// How far the zone is ahead of UTC at that moment, in minutes.
export function offsetMinutes(ms, zone) {
  const p = parts(ms, zone);
  return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000) / 60000);
}

// The moment (in milliseconds) when the clock in `zone` shows year-month-day hour:minute.
export function zonedToInstant({ year, month, day, hour, minute }, zone) {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let guess = wall - offsetMinutes(wall, zone) * 60000;
  guess = wall - offsetMinutes(guess, zone) * 60000;
  return guess;
}

export function formatInZone(ms, zone, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, { timeZone: zone, dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h23' }).format(new Date(ms));
}

export const formatOffset = (minutes) => `UTC${minutes < 0 ? '-' : '+'}${String(Math.floor(Math.abs(minutes) / 60)).padStart(2, '0')}:${String(Math.abs(minutes) % 60).padStart(2, '0')}`;
