// Two ways to split: keep chosen pages as one PDF, or make one PDF for every page.
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

export async function extractPages(bytes, indices, onProgress) {
  const source = await loadPdf(bytes);
  return buildPdfFromPages(source, indices.map((index) => ({ index })), onProgress);
}

// Returns [{ name, data }] with names like page-01.pdf.
export async function splitEveryPage(bytes, onProgress) {
  const source = await loadPdf(bytes);
  const total = source.getPageCount();
  const width = String(total).length;
  const files = [];
  for (let index = 0; index < total; index += 1) {
    const data = await buildPdfFromPages(source, [{ index }]);
    files.push({ name: `page-${String(index + 1).padStart(width, '0')}.pdf`, data });
    onProgress?.(((index + 1) / total) * 100);
    await yieldToUi();
  }
  return files;
}
