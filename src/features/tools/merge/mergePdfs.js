// Joins several PDFs into one, in the order given.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// pdfBytes: array of Uint8Array. Returns the merged PDF as a Uint8Array.
export async function mergePdfs(pdfBytes, onProgress) {
  const output = await createPdf();
  for (let i = 0; i < pdfBytes.length; i += 1) {
    const source = await loadPdf(pdfBytes[i]);
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
    onProgress?.(((i + 1) / pdfBytes.length) * 100);
    await yieldToUi();
  }
  return output.save();
}
