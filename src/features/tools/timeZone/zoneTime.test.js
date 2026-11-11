// Tests time zone conversion with known times.
import { describe, it, expect } from 'vitest';
import { formatOffset, offsetMinutes, zonedToInstant } from './zoneTime.js';

const at = (iso) => Date.parse(iso);

describe('zoneTime', () => {
  it('knows the offsets', () => {
    expect(offsetMinutes(at('2026-11-09T00:00:00Z'), 'Asia/Kolkata')).toBe(330);
    expect(offsetMinutes(at('2026-11-09T00:00:00Z'), 'America/New_York')).toBe(-300);
    expect(offsetMinutes(at('2026-07-09T00:00:00Z'), 'America/New_York')).toBe(-240);
  });
  it('turns a clock time in a zone into the right moment', () => {
    expect(zonedToInstant({ year: 2026, month: 11, day: 9, hour: 10, minute: 0 }, 'Asia/Kolkata')).toBe(at('2026-11-09T04:30:00Z'));
    expect(zonedToInstant({ year: 2026, month: 7, day: 9, hour: 9, minute: 0 }, 'America/New_York')).toBe(at('2026-07-09T13:00:00Z'));
  });
  it('writes offsets', () => {
    expect(formatOffset(330)).toBe('UTC+05:30');
    expect(formatOffset(-300)).toBe('UTC-05:00');
  });
});
