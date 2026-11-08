// Tests for imagesToPdf with a tiny JPG and PNG.
import { describe, it, expect } from 'vitest';
import { imagesToPdf } from './imagesToPdf.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { tinyJpg, tinyPng } from '../../../shared/lib/testImages.js';

const images = [{ bytes: tinyJpg, type: 'jpg' }, { bytes: tinyPng, type: 'png' }];

describe('imagesToPdf', () => {
  it('makes one page per picture, sized to the picture', async () => {
    const doc = await loadPdf(await imagesToPdf(images, { pageMode: 'fit' }));
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getSize()).toEqual({ width: 12, height: 6 });
  });
  it('puts pictures on A4, turning the page for wide pictures', async () => {
    const doc = await loadPdf(await imagesToPdf(images, { pageMode: 'a4' }));
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(841.89, 1);
    expect(height).toBeCloseTo(595.28, 1);
  });
  it('reports a picture it cannot read', async () => {
    await expect(imagesToPdf([{ bytes: new Uint8Array([1, 2, 3]), type: 'png' }])).rejects.toMatchObject({
      errorKey: 'error.imageBad',
    });
  });
});
