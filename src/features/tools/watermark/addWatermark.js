// Adds a slanted, see-through text watermark to every page. Works with English and Hindi, and on turned pages.
import { rgb, degrees } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// Returns { bytes, replaced }.
export async function addWatermark(bytes, text, { loadBytes } = {}, onProgress) {
  const label = text.replace(/\s+/g, ' ').trim();
  if (!label) throw Object.assign(new Error('no text'), { errorKey: 'error.watermarkEmpty' });
  const doc = await loadPdf(bytes);
  const book = await createFontBook(doc, { deva: hasDeva(label), bold: true, loadBytes });
  const cleaned = book.clean(label);
  const line = wrapPieces(book, [{ text: cleaned, face: 'bold' }], 1, 1e9)[0];
  const unit = line.width;
  const angle = Math.PI / 4;
  const pages = doc.getPages();

  for (let i = 0; i < pages.length; i += 1) {
    const { shown, rotation, toPage } = pageGeometry(pages[i]);
    const size = Math.max(10, Math.min(160, (0.7 * Math.hypot(shown.width, shown.height)) / unit));
    const half = (unit * size) / 2;
    const startX = shown.width / 2 - half * Math.cos(angle) + size * 0.35 * Math.sin(angle);
    const startY = shown.height / 2 - half * Math.sin(angle) - size * 0.35 * Math.cos(angle);
    let advance = 0;
    for (const seg of line.segments) {
      const spot = toPage({ x: startX + advance * Math.cos(angle), y: startY + advance * Math.sin(angle) });
      if (!/^ +$/.test(seg.text)) {
        pages[i].drawText(seg.text, {
          ...spot,
          size,
          font: book.font(seg.face, seg.script),
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45 + rotation),
        });
      }
      advance += book.width(seg.face, seg.script, seg.text, size);
    }
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return { bytes: await doc.save(), replaced: book.replaced };
}
