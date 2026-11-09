// Tests that the hidden details are found and removed.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { cleanMetadata, findMetadata } from './cleanMetadata.js';

async function withDetails() {
  const doc = await PDFDocument.create();
  doc.addPage();
  doc.setTitle('Secret plan');
  doc.setAuthor('Ravi');
  doc.setCreator('My phone');
  return doc.save();
}

describe('cleanMetadata', () => {
  it('finds the details, then removes them', async () => {
    const bytes = await withDetails();
    expect(await findMetadata(bytes)).toEqual(expect.arrayContaining(['Title', 'Author', 'Creator']));
    const clean = await cleanMetadata(bytes);
    const after = await PDFDocument.load(clean, { updateMetadata: false });
    expect(after.getTitle()).toBeUndefined();
    expect(after.getAuthor()).toBeUndefined();
    expect(after.getCreator()).toBeUndefined();
    expect(after.getPageCount()).toBe(1);
  });
});
