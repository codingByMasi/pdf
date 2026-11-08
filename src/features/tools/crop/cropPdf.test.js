// Tests for crop: the visible box shrinks, even on turned pages, and silly cuts are refused.
import { describe, it, expect } from 'vitest';
import { PDFDocument, degrees } from 'pdf-lib';
import { cropPdf } from './cropPdf.js';

async function sample(rotation = 0) {
  const doc = await PDFDocument.create();
  doc.addPage([200, 400]).setRotation(degrees(rotation));
  return doc.save();
}

async function cropBox(bytes) {
  const page = (await PDFDocument.load(bytes)).getPage(0);
  return page.getCropBox();
}

describe('cropPdf', () => {
  it('cuts the given share from each side', async () => {
    const box = await cropBox(await cropPdf(await sample(), { top: 10, bottom: 5, left: 20, right: 0 }));
    expect(box).toMatchObject({ x: 40, y: 20, width: 160, height: 340 });
  });

  it('treats the sides as seen on a page turned to the right', async () => {
    // Turned 90: the page is seen 400 wide and 200 high. Cut 25% from the left of what you see.
    const box = await cropBox(await cropPdf(await sample(90), { top: 0, bottom: 0, left: 25, right: 0 }));
    expect(box.height).toBeCloseTo(300);
    expect(box.width).toBeCloseTo(200);
    expect(box.y).toBeCloseTo(100);
  });

  it('refuses cuts that remove the page', async () => {
    await expect(cropPdf(await sample(), { top: 50, bottom: 50, left: 0, right: 0 })).rejects.toMatchObject({ errorKey: 'error.cropTooBig' });
    await expect(cropPdf(await sample(), { top: -1, bottom: 0, left: 0, right: 0 })).rejects.toMatchObject({ errorKey: 'error.cropTooBig' });
  });
});
