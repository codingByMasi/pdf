// Tests splitting by size with small real PDFs.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { splitBySize } from './splitBySize.js';

async function makePdf(pages) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i += 1) doc.addPage([200, 200]).drawText(`Page ${i + 1} `.repeat(40), { x: 5, y: 100, size: 8 });
  return doc.save();
}

describe('splitBySize', () => {
  it('makes one part when the file is under the limit', async () => {
    const result = await splitBySize(await makePdf(4), 10_000_000);
    expect(result.parts).toBe(1);
    expect(result.tooBig).toBe(0);
  });
  it('makes several parts under a tight limit and counts pages that are still too big', async () => {
    const result = await splitBySize(await makePdf(6), 100);
    expect(result.parts).toBe(6);
    expect(result.tooBig).toBe(6);
  });
});
