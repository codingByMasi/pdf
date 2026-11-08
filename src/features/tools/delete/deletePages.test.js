// Tests for the delete plans and for saving a PDF without the removed pages.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { pagesToKeep, toggleRemoved } from './deletePages.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';

describe('delete plans', () => {
  it('toggles pages on and off', () => {
    const once = toggleRemoved(new Set(), 2);
    expect([...once]).toEqual([2]);
    expect(toggleRemoved(once, 2).size).toBe(0);
  });
  it('keeps the pages that were not removed', () => {
    expect(pagesToKeep(4, new Set([1, 2])).map((p) => p.index)).toEqual([0, 3]);
  });
});

describe('deleting pages', () => {
  it('saves a PDF without the removed pages', async () => {
    const doc = await PDFDocument.create();
    [100, 110, 120, 130].forEach((w) => doc.addPage([w, 200]));
    const source = await loadPdf(await doc.save());
    const out = await loadPdf(await buildPdfFromPages(source, pagesToKeep(4, new Set([1, 2]))));
    expect(out.getPageCount()).toBe(2);
    expect(out.getPage(1).getWidth()).toBe(130);
  });
});
