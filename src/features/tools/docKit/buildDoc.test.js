// Tests for the document builder: pages, fonts, Hindi and the rupee sign.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { buildDoc, hexToRgb } from './buildDoc.js';

describe('buildDoc', () => {
  it('makes a page with flowing text and a table', async () => {
    const { bytes, replaced } = await buildDoc(['Hello'], (c) => {
      c.write('Hello world', { size: 20, face: 'bold' });
      c.table([['Item', 'Amount'], ['Pen', '10']], [{ width: 3 }, { width: 1, align: 'right' }]);
    }, { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect(replaced).toBe(0);
  });
  it('starts new pages when a table is long', async () => {
    const rows = Array.from({ length: 120 }, (_, i) => [`Row ${i}`, String(i)]);
    const { bytes } = await buildDoc(['x'], (c) => c.table(rows, [{ width: 1 }, { width: 1 }], { header: false }), { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(2);
  });
  it('shows Hindi and the rupee sign without question marks', async () => {
    const { replaced } = await buildDoc(['नमस्ते ₹'], (c) => c.write('नमस्ते ₹500 Total'), { loadBytes: loadTestFont });
    expect(replaced).toBe(0);
  });
  it('reads colours', () => {
    expect(hexToRgb('#ff0000')).toEqual([1, 0, 0]);
    expect(hexToRgb('nope')).toHaveLength(3);
  });
});
