// Tests that only the chosen pages are copied, in order.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { assemblePdf } from './assemblePdf.js';

async function makePdf(count, width) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i += 1) doc.addPage([width + i, 100]);
  return doc.save();
}

describe('assemblePdf', () => {
  it('takes chosen pages and all pages in order', async () => {
    const out = await PDFDocument.load(await assemblePdf([
      { bytes: await makePdf(4, 100), pages: [1, 3] },
      { bytes: await makePdf(2, 500), pages: null },
    ]));
    expect(out.getPageCount()).toBe(4);
    expect(out.getPages().map((p) => p.getWidth())).toEqual([101, 103, 500, 501]);
  });
});
