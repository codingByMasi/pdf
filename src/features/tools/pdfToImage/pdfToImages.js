// Draws every page of a PDF as a PNG or JPG picture, using pdf.js.
import { config } from '../../../config.js';
import { fitScale } from '../../../shared/lib/fitScale.js';
import { loadPdfjs } from '../../../shared/lib/pdfjs.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const FORMATS = {
  png: { mime: 'image/png', extension: 'png', quality: undefined },
  jpg: { mime: 'image/jpeg', extension: 'jpg', quality: 0.92 },
};

// Returns [{ name, data }] ready for the zip maker.
export async function pdfToImages(file, { format, scale }, onProgress) {
  const spec = FORMATS[format];
  const pdfjs = await loadPdfjs();
  const buffer = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  try {
    const doc = await task.promise;
    if (doc.numPages > config.limits.maxImagePages) {
      throw Object.assign(new Error('too many pages'), { errorKey: 'error.tooManyPages' });
    }
    const width = String(doc.numPages).length;
    const files = [];
    for (let n = 1; n <= doc.numPages; n += 1) {
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: fitScale(base.width, base.height, scale) });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, spec.mime, spec.quality));
      if (!blob) throw new Error('picture failed');
      files.push({ name: `page-${String(n).padStart(width, '0')}.${spec.extension}`, data: new Uint8Array(await blob.arrayBuffer()) });
      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
      onProgress?.((n / doc.numPages) * 100);
      await yieldToUi();
    }
    return files;
  } finally {
    task.destroy();
  }
}
