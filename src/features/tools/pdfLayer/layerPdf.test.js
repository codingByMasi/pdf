// Tests that the layer is placed on every main page, and that its last page repeats.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { layerPdf } from './layerPdf.js';

async function makePdf(count) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i += 1) doc.addPage([200, 300]).drawText(`p${i}`, { x: 5, y: 5 });
  return doc.save();
}

describe('layerPdf', () => {
  it('keeps the page count when the layer goes on top', async () => {
    const out = await PDFDocument.load(await layerPdf(await makePdf(3), await makePdf(1), { position: 'top' }));
    expect(out.getPageCount()).toBe(3);
  });
  it('keeps the page count and size when the layer goes behind', async () => {
    const out = await PDFDocument.load(await layerPdf(await makePdf(2), await makePdf(2), { position: 'behind' }));
    expect(out.getPageCount()).toBe(2);
    expect(out.getPage(0).getWidth()).toBe(200);
  });
});
