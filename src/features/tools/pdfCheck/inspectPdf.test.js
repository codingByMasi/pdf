// Tests for looking inside a PDF: version, page sizes, fonts and attachments.
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { inspectPdf, paperName } from './inspectPdf.js';

describe('paperName', () => {
  it('knows A4 and Letter, in either direction', () => {
    expect(paperName(595.28, 841.89)).toBe('A4');
    expect(paperName(841.89, 595.28)).toBe('A4');
    expect(paperName(612, 792)).toBe('Letter');
  });
  it('gives millimetres for other sizes', () => {
    expect(paperName(300, 400)).toBe('106 × 141 mm');
  });
});

describe('inspectPdf', () => {
  it('reports pages, sizes, fonts and attachments', async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    doc.addPage([595.28, 841.89]).drawText('Hi', { font });
    doc.addPage([612, 792]);
    await doc.attach(new Uint8Array([1, 2, 3]), 'a.bin', { mimeType: 'application/octet-stream' });
    const facts = await inspectPdf(await doc.save());
    expect(facts.pages).toBe(2);
    expect(facts.sizes.map((s) => s.name).sort()).toEqual(['A4', 'Letter']);
    expect(facts.fonts.map((f) => f.name)).toContain('Helvetica');
    expect(facts.attachments).toBe(true);
    expect(facts.version).toMatch(/^1\.\d$/);
    expect(facts.scripts).toBe(false);
  });
});
