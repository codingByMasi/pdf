// Tests for the GST calculator.
import { describe, expect, it } from 'vitest';
import { calcGst } from './calcGst.js';

describe('calcGst', () => {
  it('adds GST', () => expect(calcGst(1000, 18, 'add')).toEqual({ ok: true, base: 1000, gst: 180, cgst: 90, sgst: 90, total: 1180 }));
  it('removes GST', () => expect(calcGst(1180, 18, 'remove')).toEqual({ ok: true, base: 1000, gst: 180, cgst: 90, sgst: 90, total: 1180 }));
  it('keeps CGST plus SGST equal to GST on odd paise', () => {
    const r = calcGst(100.01, 5, 'add');
    expect(r.cgst + r.sgst).toBeCloseTo(r.gst, 5);
  });
  it('rejects negatives', () => expect(calcGst(-1, 18).ok).toBe(false));
});
