// Tests for page numbers: labels, start number, skipping the first page and turned pages.
import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFRawStream, decodePDFRawStream, degrees } from 'pdf-lib';
import { addNumbers } from './addNumbers.js';

async function sample(rotations) {
  const doc = await PDFDocument.create();
  rotations.forEach((r) => doc.addPage([300, 400]).setRotation(degrees(r)));
  return doc.save();
}

async function pageTexts(bytes) {
  const doc = await PDFDocument.load(bytes);
  return doc.context
    .enumerateIndirectObjects()
    .filter(([, o]) => o instanceof PDFRawStream)
    .map(([, o]) => Buffer.from(decodePDFRawStream(o).decode()).toString('latin1'));
}

const hex = (text) => `<${Buffer.from(text, 'latin1').toString('hex').toUpperCase()}>`;
const base = { vertical: 'bottom', horizontal: 'center', style: 'simple', start: 1, skipFirst: false };

describe('addNumbers', () => {
  it('numbers every page with a total', async () => {
    const out = await pageTexts(await addNumbers(await sample([0, 0, 0]), { ...base, style: 'total' }));
    const all = out.join('\n');
    for (const label of ['1 / 3', '2 / 3', '3 / 3']) expect(all).toContain(hex(label));
  });

  it('can start at another number and skip the first page', async () => {
    const out = (await pageTexts(await addNumbers(await sample([0, 0, 0]), { ...base, start: 5, skipFirst: true }))).join('\n');
    expect(out).not.toContain(hex('7'));
    expect(out).toContain(hex('5'));
    expect(out).toContain(hex('6'));
    expect(out.split(hex('5')).length).toBe(2);
  });

  it('works on turned pages, top and left', async () => {
    const bytes = await addNumbers(await sample([90, 180, 270]), { ...base, vertical: 'top', horizontal: 'left' });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(3);
  });
});
