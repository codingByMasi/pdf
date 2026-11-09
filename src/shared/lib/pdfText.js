// Reads the text of every page of a PDF with pdf.js. Scanned PDFs (pictures only) give empty text.
import { loadPdfjs } from './pdfjs.js';
import { yieldToUi } from './yieldToUi.js';

// Returns an array with one text string per page.
export async function extractPageTexts(file, onProgress) {
  const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  const doc = await task.promise;
  const texts = [];
  try {
    for (let n = 1; n <= doc.numPages; n += 1) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      let text = '';
      for (const item of content.items) text += item.str + (item.hasEOL ? '\n' : ' ');
      texts.push(text.replace(/[ \t]+\n/g, '\n').replace(/ {2,}/g, ' ').trim());
      page.cleanup();
      onProgress?.((n / doc.numPages) * 100);
      if (n % 5 === 0) await yieldToUi();
    }
  } finally {
    await task.destroy();
  }
  return texts;
}
