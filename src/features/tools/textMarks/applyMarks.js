// Draws highlight boxes on pages, or covers the found words with white and writes new words on top.
import { rgb, degrees } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';

// marks: [{ page, x, y, width, height, angle, baseline, size }]. mode 'highlight' or 'replace' (with replacement text).
// Returns { bytes, count, replaced }.
export async function applyMarks(bytes, marks, { mode, replacement = '' }, { loadBytes } = {}) {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let book = null;
  if (mode === 'replace' && replacement) book = await createFontBook(doc, { deva: hasDeva(replacement), loadBytes });
  const text = book ? book.clean(replacement.replace(/\s+/g, ' ').trim()) : '';
  for (const m of marks) {
    const page = pages[m.page];
    if (!page) continue;
    const rotate = degrees(m.angle);
    if (mode === 'highlight') {
      page.drawRectangle({ x: m.x, y: m.y, width: m.width, height: m.height, rotate, color: rgb(1, 0.93, 0.1), opacity: 0.45 });
    } else {
      page.drawRectangle({ x: m.x, y: m.y, width: m.width + 1, height: m.height, rotate, color: rgb(1, 1, 1) });
      if (text && book) {
        const script = hasDeva(text) ? 'deva' : 'latin';
        page.drawText(text, { x: m.baseline.x, y: m.baseline.y, size: m.size, font: book.font('regular', script), color: rgb(0, 0, 0), rotate });
      }
    }
  }
  return { bytes: await doc.save(), count: marks.length, replaced: book?.replaced ?? 0 };
}
