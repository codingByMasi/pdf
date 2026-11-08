// Builds a PDF where every page is one picture of the page's own size (used by Flatten and Redact).
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// pages: [{ bytes (JPEG), width, height }] with the size in points. Returns the PDF bytes.
export async function rasterPagesToPdf(pages, onProgress) {
  const doc = await createPdf();
  for (let i = 0; i < pages.length; i += 1) {
    const image = await doc.embedJpg(pages[i].bytes);
    const page = doc.addPage([pages[i].width, pages[i].height]);
    page.drawImage(image, { x: 0, y: 0, width: pages[i].width, height: pages[i].height });
    onProgress?.(((i + 1) / pages.length) * 100);
    await yieldToUi();
  }
  return doc.save();
}
