// Draws pages of a PDF as JPEG pictures with pdf.js, in small steps so the page stays smooth.
import { config } from '../../config.js';
import { fitScale } from './fitScale.js';
import { loadPdfjs } from './pdfjs.js';
import { yieldToUi } from './yieldToUi.js';

// options: { pages: null | array of page numbers starting at 0, scale (1 = 72 dpi), quality (0-1), draw(context, scaleUsed, pageIndex) }
// Returns [{ index, bytes, width, height }] where width and height are the page size in points as you see it.
export async function rasterizePdf(bytes, { pages = null, scale = 2, quality = 0.85, draw } = {}, onProgress) {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: new Uint8Array(bytes).slice(), isEvalSupported: false });
  try {
    const doc = await task.promise;
    const wanted = pages ?? Array.from({ length: doc.numPages }, (_, i) => i);
    if (wanted.length > config.limits.maxImagePages) {
      throw Object.assign(new Error('too many pages'), { errorKey: 'error.tooManyPages' });
    }
    const out = [];
    for (let k = 0; k < wanted.length; k += 1) {
      const index = wanted[k];
      const page = await doc.getPage(index + 1);
      const base = page.getViewport({ scale: 1 });
      const used = fitScale(base.width, base.height, scale);
      const viewport = page.getViewport({ scale: used });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;
      draw?.(context, used, index, canvas);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (!blob) throw new Error('picture failed');
      out.push({ index, bytes: new Uint8Array(await blob.arrayBuffer()), width: base.width, height: base.height });
      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
      onProgress?.(((k + 1) / wanted.length) * 100);
      await yieldToUi();
    }
    return out;
  } finally {
    task.destroy();
  }
}
