// Every job that can run in the worker. Each takes one payload and returns the finished file(s).
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { compressPdf } from '../compress/compressPdf.js';
import { imagesToPdf } from '../jpgToPdf/imagesToPdf.js';
import { mergePdfs } from '../merge/mergePdfs.js';
import { splitEveryPage } from '../split/splitPdf.js';
import { addMarks } from '../watermark/addMarks.js';

export const tasks = {
  merge: ({ pdfs }, { onProgress }) => mergePdfs(pdfs, onProgress),

  // pages: [{ index, rotation }] - used by split (range), rotate, delete, extract, organize.
  buildPages: async ({ bytes, pages }, { onProgress }) => buildPdfFromPages(await loadPdf(bytes), pages, onProgress),

  splitToZip: async ({ bytes }, { onProgress }) => makeZip(await splitEveryPage(bytes, onProgress)),

  imagesToPdf: ({ images, pageMode }, { onProgress }) => imagesToPdf(images, { pageMode }, onProgress),

  addMarks: ({ bytes, options }, { onProgress }) => addMarks(bytes, options, onProgress),

  compress: ({ bytes, maxSide, quality }, { onProgress, callMain }) =>
    compressPdf(
      bytes,
      { maxSide, quality, recompress: (image, limits) => callMain('recompress', { bytes: image, ...limits }) },
      onProgress,
    ),
};
