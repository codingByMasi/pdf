// Tests for the watermark: English and Hindi are drawn, turned pages work, empty text is refused.
import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFName, PDFDict, degrees } from 'pdf-lib';
import { addWatermark } from './addWatermark.js';
import { loadTestFont } from '../../../shared/lib/testFonts.js';

const opts = { loadBytes: loadTestFont };

async function sample(rotations = [0, 0]) {
  const doc = await PDFDocument.create();
  rotations.forEach((r) => doc.addPage([300, 400]).setRotation(degrees(r)));
  return doc.save();
}

// Names of the fonts that ended up inside the PDF.
async function fontNames(bytes) {
  const doc = await PDFDocument.load(bytes);
  return doc.context
    .enumerateIndirectObjects()
    .filter(([, o]) => o instanceof PDFDict && o.get(PDFName.of('Type')) === PDFName.of('FontDescriptor'))
    .map(([, o]) => String(o.get(PDFName.of('FontName'))));
}

describe('addWatermark', () => {
  it('draws English text and keeps the page count', async () => {
    const { bytes } = await addWatermark(await sample(), 'DRAFT', opts);
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
    expect((await fontNames(bytes)).join()).toContain('NotoSans');
  });

  it('draws Hindi text with the Hindi font', async () => {
    const { bytes, replaced } = await addWatermark(await sample(), 'गोपनीय Draft', opts);
    expect(replaced).toBe(0);
    expect((await fontNames(bytes)).join()).toContain('Devanagari');
  });

  it('works on turned pages', async () => {
    const { bytes } = await addWatermark(await sample([90, 180, 270]), 'X', opts);
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(3);
  });

  it('refuses empty words', async () => {
    await expect(addWatermark(await sample(), '   ', opts)).rejects.toMatchObject({ errorKey: 'error.watermarkEmpty' });
  });
});
