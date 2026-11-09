// Tests for the invoice sums.
import { describe, expect, it } from 'vitest';
import { computeInvoice } from './invoiceMath.js';

describe('computeInvoice', () => {
  it('adds lines and GST', () => {
    const r = computeInvoice([{ desc: 'Pen', qty: '10', rate: '12.5' }, { desc: 'Book', qty: 2, rate: 100 }], 18);
    expect(r).toMatchObject({ subtotal: 325, gst: 58.5, cgst: 29.25, sgst: 29.25, total: 383.5 });
    expect(r.lines).toHaveLength(2);
  });
  it('skips empty rows and works with no GST', () => {
    const r = computeInvoice([{ desc: '', qty: '', rate: '' }, { desc: 'Work', qty: 1, rate: 500 }], 0);
    expect(r.lines).toHaveLength(1);
    expect(r.total).toBe(500);
  });
  it('keeps CGST plus SGST equal to GST', () => {
    const r = computeInvoice([{ desc: 'x', qty: 1, rate: 0.03 }], 5);
    expect(r.cgst + r.sgst).toBeCloseTo(r.gst, 6);
  });
});
