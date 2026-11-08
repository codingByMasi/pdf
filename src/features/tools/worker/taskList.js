// Every job that can run in the worker. Each takes one payload and returns the finished file(s).
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { compressPdf } from '../compress/compressPdf.js';
import { imagesToPdf } from '../jpgToPdf/imagesToPdf.js';
import { mergePdfs } from '../merge/mergePdfs.js';
import { splitEveryPage } from '../split/splitPdf.js';
import { addWatermark } from '../watermark/addWatermark.js';
import { addNumbers } from '../numberPages/addNumbers.js';
import { cropPdf } from '../crop/cropPdf.js';
import { flattenForms } from '../flatten/flattenForms.js';
import { rasterPagesToPdf } from '../flatten/rasterPagesToPdf.js';
import { csvToPdf } from '../csvToPdf/csvToPdf.js';
import { htmlToPdf } from '../htmlToPdf/htmlToPdf.js';
import { textToPdf } from '../txtToPdf/textToPdf.js';

export const tasks = {
  merge: ({ pdfs }, { onProgress }) => mergePdfs(pdfs, onProgress),

  // pages: [{ index, rotation }] - used by split (range), rotate, delete, extract, organize.
  buildPages: async ({ bytes, pages }, { onProgress }) => buildPdfFromPages(await loadPdf(bytes), pages, onProgress),

  splitToZip: async ({ bytes }, { onProgress }) => makeZip(await splitEveryPage(bytes, onProgress)),

  imagesToPdf: ({ images, pageMode }, { onProgress }) => imagesToPdf(images, { pageMode }, onProgress),

  // Returns { bytes, replaced }.
  watermark: ({ bytes, text }, { onProgress }) => addWatermark(bytes, text, {}, onProgress),

  numberPages: ({ bytes, options }, { onProgress }) => addNumbers(bytes, options, onProgress),

  crop: ({ bytes, cuts }, { onProgress }) => cropPdf(bytes, cuts, onProgress),

  // Returns { bytes, fields }.
  flattenForms: ({ bytes }) => flattenForms(bytes),

  // pages: [{ bytes, width, height }] pictures of whole pages.
  rasterPages: ({ pages }, { onProgress }) => rasterPagesToPdf(pages, onProgress),

  // These three return { bytes, replaced } where replaced counts letters shown as "?".
  textToPdf: ({ text }, { onProgress }) => textToPdf(text, {}, onProgress),

  csvToPdf: ({ text }, { onProgress }) => csvToPdf(text, {}, onProgress),

  htmlToPdf: ({ blocks }, { onProgress }) => htmlToPdf(blocks, {}, onProgress),

  compress: ({ bytes, maxSide, quality }, { onProgress, callMain }) =>
    compressPdf(
      bytes,
      { maxSide, quality, recompress: (image, limits) => callMain('recompress', { bytes: image, ...limits }) },
      onProgress,
    ),
};
