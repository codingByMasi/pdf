// Tests for the rotate plans and for saving a turned, reordered PDF.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { startEdits, turnPage, movePage } from './rotatePages.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';

async function sample(pages) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i += 1) doc.addPage([100 + i * 10, 200]);
  return doc.save();
}

describe('rotate plans', () => {
  it('turns right and left, wrapping around', () => {
    let edits = startEdits(2);
    edits = turnPage(edits, 0, 90);
    edits = turnPage(edits, 1, -90);
    expect(edits.map((e) => e.rotation)).toEqual([90, 270]);
    expect(turnPage(edits, 0, 270)[0].rotation).toBe(0);
  });
  it('moves pages and stays inside the list', () => {
    const edits = startEdits(3);
    expect(movePage(edits, 0, 1).map((e) => e.index)).toEqual([1, 0, 2]);
    expect(movePage(edits, 0, -1)).toBe(edits);
    expect(movePage(edits, 2, 1)).toBe(edits);
  });
});

describe('buildPdfFromPages', () => {
  it('keeps the new order and turns', async () => {
    const source = await loadPdf(await sample(3));
    const edits = movePage(movePage(turnPage(startEdits(3), 0, 90), 0, 1), 1, 1); // page 1 turned, moved to the end
    const result = await loadPdf(await buildPdfFromPages(source, edits));
    expect(result.getPageCount()).toBe(3);
    expect(result.getPage(0).getWidth()).toBe(110);
    expect(result.getPage(2).getWidth()).toBe(100);
    expect(result.getPage(2).getRotation().angle).toBe(90);
    expect(result.getPage(0).getRotation().angle).toBe(0);
  });
  it('adds to a turn that is already in the file', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([100, 200]);
    const { degrees } = await import('pdf-lib');
    page.setRotation(degrees(90));
    const source = await loadPdf(await doc.save());
    const result = await loadPdf(await buildPdfFromPages(source, [{ index: 0, rotation: 270 }]));
    expect(result.getPage(0).getRotation().angle).toBe(0);
  });
});
