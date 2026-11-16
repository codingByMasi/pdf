// Tests that a poster has grid x grid sheets per page, in the paper size.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { makePoster } from './makePoster.js';

async function makePdf(sizes) {
  const doc = await PDFDocument.create();
  for (const size of sizes) doc.addPage(size).drawText('x', { x: 5, y: 5 });
  return doc.save();
}

describe('makePoster', () => {
  it('makes 4 sheets for a 2 x 2 poster', async () => {
    const out = await PDFDocument.load(await makePoster(await makePdf([[300, 400]]), { grid: 2, paper: 'a4' }));
    expect(out.getPageCount()).toBe(4);
    expect(Math.round(out.getPage(0).getWidth())).toBe(595);
  });
  it('makes 9 sheets per page for 3 x 3, with sideways sheets for a wide page', async () => {
    const out = await PDFDocument.load(await makePoster(await makePdf([[400, 300], [400, 300]]), { grid: 3, paper: 'letter' }));
    expect(out.getPageCount()).toBe(18);
    expect(out.getPage(0).getWidth()).toBe(792);
  });
});
