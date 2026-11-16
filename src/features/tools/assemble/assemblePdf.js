// Builds one PDF from chosen pages of several PDFs, in the order given.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// parts: [{ bytes, pages }] where pages is an array of page numbers starting at 0, or null for every page.
export async function assemblePdf(parts, onProgress) {
  const output = await createPdf();
  for (let i = 0; i < parts.length; i += 1) {
    const source = await loadPdf(parts[i].bytes);
    const copied = await output.copyPages(source, parts[i].pages ?? source.getPageIndices());
    copied.forEach((page) => output.addPage(page));
    onProgress?.(((i + 1) / parts.length) * 100);
    await yieldToUi();
  }
  return output.save();
}
