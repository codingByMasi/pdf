// Tests that an invoice PDF is made, with Hindi names and the rupee sign.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { invoicePdf } from './invoicePdf.js';

const data = { seller: 'आशा स्टोर', sellerAddress: 'Delhi', sellerTax: '07ABCDE1234F1Z5', buyer: 'Ravi', buyerAddress: '', buyerTax: '', number: 'INV-1', date: '2024-03-15', items: [{ desc: 'Pen', qty: '2', rate: '10' }, { desc: 'किताब', qty: '1', rate: '250.50' }], gst: '18', notes: 'Pay in 7 days', accent: '#1d4ed8' };

describe('invoicePdf', () => {
  it('makes a one page PDF with no missing letters', async () => {
    const { bytes, replaced } = await invoicePdf(data, await tFor('en'), { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect(replaced).toBe(0);
  });
  it('works in Hindi and with many items', async () => {
    const many = { ...data, items: Array.from({ length: 60 }, (_, i) => ({ desc: `Item ${i}`, qty: '1', rate: '5' })) };
    const { bytes, replaced } = await invoicePdf(many, await tFor('hi'), { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(1);
    expect(replaced).toBe(0);
  });
});
