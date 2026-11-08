// Tests for addMarks: text is really drawn, turned pages work, and unsupported letters are reported.
import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFRawStream, decodePDFRawStream, degrees } from 'pdf-lib';
import { addMarks } from './addMarks.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';

async function sample(rotations = [0, 0]) {
  const doc = await PDFDocument.create();
  rotations.forEach((r) => doc.addPage([300, 400]).setRotation(degrees(r)));
  return doc.save();
}

// Reads the drawing instructions of all pages, so we can look for the text that was added.
async function asText(bytes) {
  const doc = await loadPdf(bytes);
  return doc.context
    .enumerateIndirectObjects()
    .filter(([, object]) => object instanceof PDFRawStream)
    .map(([, object]) => Buffer.from(decodePDFRawStream(object).decode()).toString('latin1'))
    .join('\n');
}

// pdf-lib writes the text as hex inside the page instructions, like <44524146> for DRAFT.
const hex = (text) => `<${Buffer.from(text, 'latin1').toString('hex').toUpperCase()}>`;

describe('addMarks', () => {
  it('writes page numbers on every page', async () => {
    const out = await addMarks(await sample([0, 0, 0]), { watermarkText: '', numbers: { position: 'center', style: 'total' } });
    const text = await asText(out);
    for (const label of ['1 / 3', '2 / 3', '3 / 3']) expect(text).toContain(hex(label));
  });
  it('writes the watermark text and keeps the page count', async () => {
    const out = await addMarks(await sample(), { watermarkText: 'DRAFT', numbers: null });
    expect(await asText(out)).toContain(hex('DRAFT'));
    expect((await loadPdf(out)).getPageCount()).toBe(2);
  });
  it('works on turned pages', async () => {
    const out = await addMarks(await sample([90, 180, 270]), { watermarkText: 'X', numbers: { position: 'right', style: 'simple' } });
    expect((await loadPdf(out)).getPageCount()).toBe(3);
  });
  it('reports letters the font cannot draw', async () => {
    await expect(addMarks(await sample(), { watermarkText: 'हिन्दी', numbers: null })).rejects.toMatchObject({
      errorKey: 'error.watermarkChars',
    });
  });
});
