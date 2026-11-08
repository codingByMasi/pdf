// Splits a PDF into one small PDF for every page.
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

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
