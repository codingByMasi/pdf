// Tests pages-per-sheet and resize with small real PDFs.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { nUp, resizePages } from './sheetPages.js';

async function makePdf(sizes) {
  const doc = await PDFDocument.create();
  for (const size of sizes) doc.addPage(size).drawText('x', { x: 5, y: 5 });
  return doc.save();
}

describe('sheetPages', () => {
  it('puts 2 pages on each landscape A4 sheet', async () => {
    const out = await PDFDocument.load(await nUp(await makePdf([[100, 100], [100, 100], [100, 100]]), { perSheet: 2, paper: 'a4' }));
    expect(out.getPageCount()).toBe(2);
    expect(out.getPage(0).getWidth()).toBeGreaterThan(out.getPage(0).getHeight());
  });
  it('puts 4 pages on each portrait sheet', async () => {
    const out = await PDFDocument.load(await nUp(await makePdf(Array(5).fill([100, 100])), { perSheet: 4, paper: 'letter' }));
    expect(out.getPageCount()).toBe(2);
    expect(Math.round(out.getPage(0).getWidth())).toBe(612);
  });
  it('resizes upright and sideways pages to the paper size', async () => {
    const result = await resizePages(await makePdf([[100, 200], [300, 100]]), { paper: 'a4' });
    const out = await PDFDocument.load(result.bytes);
    expect(Math.round(out.getPage(0).getWidth())).toBe(595);
    expect(Math.round(out.getPage(1).getWidth())).toBe(842);
    expect(result.turned).toBe(0);
  });
});
