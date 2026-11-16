// Tests that halving doubles the pages and gives each half the right size.
import { describe, it, expect } from 'vitest';
import { PDFDocument, degrees } from 'pdf-lib';
import { halvePages } from './halvePages.js';

async function makePdf(turn = 0) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 200]);
  page.setRotation(degrees(turn));
  return doc.save();
}

describe('halvePages', () => {
  it('cuts a wide page into a left and a right page', async () => {
    const out = await PDFDocument.load(await halvePages(await makePdf(), { cut: 'vertical' }));
    expect(out.getPageCount()).toBe(2);
    expect(out.getPage(0).getWidth()).toBe(200);
    expect(out.getPage(0).getMediaBox().x).toBe(0);
    expect(out.getPage(1).getMediaBox().x).toBe(200);
  });
  it('cuts a page into a top and a bottom page', async () => {
    const out = await PDFDocument.load(await halvePages(await makePdf(), { cut: 'horizontal' }));
    expect(out.getPage(0).getHeight()).toBe(100);
    expect(out.getPage(0).getMediaBox().y).toBe(100);
    expect(out.getPage(1).getMediaBox().y).toBe(0);
  });
  it('keeps the visual left half first when the page is turned 90 degrees', async () => {
    const out = await PDFDocument.load(await halvePages(await makePdf(90), { cut: 'vertical' }));
    expect(out.getPage(0).getMediaBox().y).toBe(0);
    expect(out.getPage(1).getMediaBox().y).toBe(100);
    expect(out.getPage(0).getRotation().angle).toBe(90);
  });
});
