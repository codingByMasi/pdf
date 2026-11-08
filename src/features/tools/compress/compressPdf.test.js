// Tests for compressPdf with a fake picture shrinker, so it runs without a browser.
import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib';
import { compressPdf } from './compressPdf.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { tinyJpg } from '../../../shared/lib/testImages.js';

async function pdfWithPicture() {
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(tinyJpg);
  const page = doc.addPage([100, 100]);
  page.drawImage(image, { x: 0, y: 0, width: 50, height: 25 });
  return doc.save();
}

function jpegStreams(doc) {
  return doc.context
    .enumerateIndirectObjects()
    .map(([, object]) => object)
    .filter((o) => o instanceof PDFRawStream && o.dict.lookup(PDFName.of('Subtype')) === PDFName.of('Image'));
}

describe('compressPdf', () => {
  it('swaps in a smaller picture and keeps the PDF valid', async () => {
    const small = new Uint8Array(tinyJpg.length / 3);
    const calls = [];
    const result = await compressPdf(
      await pdfWithPicture(),
      { maxSide: 800, quality: 0.5, recompress: async (bytes, opts) => { calls.push(opts); return { bytes: small, width: 8, height: 4 }; } },
    );
    expect(calls).toEqual([{ maxSide: 800, quality: 0.5 }]);
    expect(result.imageCount).toBe(1);
    const doc = await loadPdf(result.bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(jpegStreams(doc)[0].getContents().length).toBe(small.length);
  });
  it('keeps the original picture when the new one is not smaller enough', async () => {
    const result = await compressPdf(
      await pdfWithPicture(),
      { maxSide: 800, quality: 0.5, recompress: async () => ({ bytes: tinyJpg, width: 16, height: 8 }) },
    );
    expect(jpegStreams(await loadPdf(result.bytes))[0].getContents().length).toBe(tinyJpg.length);
  });
  it('keeps the original picture when it cannot be shrunk', async () => {
    const result = await compressPdf(await pdfWithPicture(), { maxSide: 800, quality: 0.5, recompress: async () => null });
    expect((await loadPdf(result.bytes)).getPageCount()).toBe(1);
  });
  it('works on a PDF with no pictures', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    const result = await compressPdf(await doc.save(), { maxSide: 800, quality: 0.5, recompress: async () => null });
    expect(result.imageCount).toBe(0);
  });
});
