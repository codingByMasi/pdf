// Tests for mergePdfs and the split helpers, using small PDFs made in the test.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs } from './mergePdfs.js';
import { extractPages, splitEveryPage } from '../split/splitPdf.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';

async function sample(widths) {
  const doc = await PDFDocument.create();
  widths.forEach((w) => doc.addPage([w, 200]));
  return doc.save();
}

describe('mergePdfs', () => {
  it('joins files in the given order', async () => {
    const merged = await loadPdf(await mergePdfs([await sample([100, 110]), await sample([300])]));
    expect(merged.getPageCount()).toBe(3);
    expect(merged.getPage(2).getWidth()).toBe(300);
  });
  it('reports progress up to 100', async () => {
    const seen = [];
    await mergePdfs([await sample([100]), await sample([100])], (p) => seen.push(p));
    expect(seen).toEqual([50, 100]);
  });
  it('fails clearly on a file that is not a PDF', async () => {
    await expect(mergePdfs([new TextEncoder().encode('not a pdf')])).rejects.toThrow();
  });
});

describe('split helpers', () => {
  it('extracts chosen pages', async () => {
    const out = await loadPdf(await extractPages(await sample([100, 110, 120, 130]), [0, 3]));
    expect(out.getPageCount()).toBe(2);
    expect(out.getPage(1).getWidth()).toBe(130);
  });
  it('makes one file per page with padded names', async () => {
    const files = await splitEveryPage(await sample(Array(10).fill(100)));
    expect(files).toHaveLength(10);
    expect(files[0].name).toBe('page-01.pdf');
    expect(files[9].name).toBe('page-10.pdf');
    expect((await loadPdf(files[4].data)).getPageCount()).toBe(1);
  });
});
