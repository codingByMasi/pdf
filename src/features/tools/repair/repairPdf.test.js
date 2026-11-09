// Tests for the basic PDF repair.
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { repairPdf } from './repairPdf.js';

describe('repairPdf', () => {
  it('re-saves a good file with the same pages', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.addPage();
    const result = await repairPdf(await doc.save());
    expect(result.pages).toBe(2);
    expect(result.lost).toBe(0);
  });
  it('fails clearly for random bytes', async () => {
    await expect(repairPdf(new Uint8Array([1, 2, 3, 4]))).rejects.toMatchObject({ errorKey: 'error.repairFailed' });
  });
});
