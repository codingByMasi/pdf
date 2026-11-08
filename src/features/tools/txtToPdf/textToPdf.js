// Turns plain text into a PDF with English and Hindi letters, wrapping lines and adding pages.
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { createPageWriter } from '../../../shared/lib/pageWriter.js';
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapText } from '../../../shared/lib/textWrap.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { rgb } from 'pdf-lib';

const FONT_SIZE = 11.5;

export function emptyTextError() {
  return Object.assign(new Error('no text'), { errorKey: 'error.textEmpty' });
}

// Returns { bytes, replaced }. replaced counts letters the fonts do not have (shown as "?").
export async function textToPdf(text, { loadBytes } = {}, onProgress) {
  if (text.trim() === '') throw emptyTextError();
  const doc = await createPdf();
  const book = await createFontBook(doc, { deva: hasDeva(text), loadBytes });
  const writer = createPageWriter(doc, book);
  const lines = wrapText(book, book.clean(text), 'regular', FONT_SIZE, writer.contentWidth);
  const ink = rgb(0.1, 0.1, 0.1);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.segments.length === 0) {
      writer.ensure(FONT_SIZE * 1.4);
      writer.y -= FONT_SIZE * 1.4;
    } else writer.drawLine(line, { fontSize: FONT_SIZE, color: ink });
    if (i % 400 === 399) {
      onProgress?.(((i + 1) / lines.length) * 100);
      await yieldToUi();
    }
  }
  if (doc.getPageCount() === 0) throw emptyTextError();
  return { bytes: await doc.save(), replaced: book.replaced };
}
