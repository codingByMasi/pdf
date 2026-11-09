// Tests for borders, background colour and stamp: page counts, sizes and refusals.
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { addBackground } from '../background/addBackground.js';
import { addBorders } from '../pageBorders/addBorders.js';
import { addStamp } from './addStamp.js';

async function sample(count = 2) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i += 1) doc.addPage([300, 400]);
  return doc.save();
}
const open = (bytes) => PDFDocument.load(bytes);

describe('addBorders', () => {
  it('makes pages bigger by the margin', async () => {
    const doc = await open(await addBorders(await sample(), { marginMm: 10, frame: 'thin' }));
    const { width } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(300 + 2 * 10 * (72 / 25.4), 1);
  });
  it('adds a blank page after each page, or one at the end', async () => {
    expect((await open(await addBorders(await sample(), { blank: 'each' }))).getPageCount()).toBe(4);
    expect((await open(await addBorders(await sample(), { blank: 'end' }))).getPageCount()).toBe(3);
  });
});

describe('addBackground', () => {
  it('keeps the page count and size', async () => {
    const doc = await open(await addBackground(await sample(), 'cream'));
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getSize()).toEqual({ width: 300, height: 400 });
  });
  it('refuses an unknown colour', async () => {
    await expect(addBackground(await sample(), 'nope')).rejects.toBeTruthy();
  });
});

describe('addStamp', () => {
  it('stamps and keeps the pages', async () => {
    const result = await addStamp(await sample(), { text: 'APPROVED' }, { loadBytes: loadTestFont });
    expect((await open(result.bytes)).getPageCount()).toBe(2);
  });
  it('works for the corner and first page only', async () => {
    const result = await addStamp(await sample(3), { text: 'PAID', place: 'corner', pages: 'first' }, { loadBytes: loadTestFont });
    expect(result.bytes.length).toBeGreaterThan(0);
  });
  it('refuses empty text', async () => {
    await expect(addStamp(await sample(), { text: '  ' }, { loadBytes: loadTestFont })).rejects.toMatchObject({ errorKey: 'error.stampEmpty' });
  });
});
