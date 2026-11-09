// Reads every piece of text on every page with its place, using pdf.js. Scanned PDFs (pictures only) give nothing.
import { loadPdfjs } from './pdfjs.js';
import { yieldToUi } from './yieldToUi.js';

// Returns one list per page: [{ str, transform: [a, b, c, d, e, f], width, height }] in PDF units.
export async function extractTextItems(file, onProgress) {
  const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  const doc = await task.promise;
  const pages = [];
  try {
    for (let n = 1; n <= doc.numPages; n += 1) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      pages.push(content.items.filter((item) => item.str && item.transform).map(({ str, transform, width, height }) => ({ str, transform, width, height })));
      page.cleanup();
      onProgress?.((n / doc.numPages) * 100);
      if (n % 5 === 0) await yieldToUi();
    }
  } finally {
    await task.destroy();
  }
  return pages;
}
