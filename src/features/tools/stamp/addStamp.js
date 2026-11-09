// Puts a framed stamp such as APPROVED or DRAFT on the pages, in the middle (slanted) or in the top right corner.
import { rgb, degrees } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

export const STAMP_COLOURS = { red: [0.8, 0.1, 0.1], green: [0.1, 0.5, 0.2], blue: [0.1, 0.3, 0.75], grey: [0.35, 0.35, 0.35] };

// options: { text, colour, place: 'centre'|'corner', pages: 'all'|'first' }. Returns { bytes, replaced }.
export async function addStamp(bytes, { text, colour = 'red', place = 'centre', pages: which = 'all' }, { loadBytes } = {}, onProgress) {
  const label = text.replace(/\s+/g, ' ').trim();
  if (!label) throw Object.assign(new Error('no text'), { errorKey: 'error.stampEmpty' });
  const doc = await loadPdf(bytes);
  const book = await createFontBook(doc, { deva: hasDeva(label), bold: true, loadBytes });
  const line = wrapPieces(book, [{ text: book.clean(label), face: 'bold' }], 1, 1e9)[0];
  const [r, g, b] = STAMP_COLOURS[colour] ?? STAMP_COLOURS.red;
  const pages = doc.getPages();
  const last = which === 'first' ? 1 : pages.length;
  const tilt = place === 'centre' ? Math.PI / 12 : 0;

  for (let i = 0; i < last; i += 1) {
    const { shown, rotation, toPage } = pageGeometry(pages[i]);
    const size = Math.max(10, Math.min(place === 'centre' ? 70 : 26, ((place === 'centre' ? 0.6 : 0.3) * shown.width) / line.width));
    const textW = line.width * size;
    const pad = size * 0.35;
    const boxW = textW + pad * 2;
    const boxH = size + pad * 2;
    const cx = place === 'centre' ? shown.width / 2 : shown.width - boxW / 2 - 24;
    const cy = place === 'centre' ? shown.height / 2 : shown.height - boxH / 2 - 24;
    const turn = (dx, dy) => ({ x: cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), y: cy + dx * Math.sin(tilt) + dy * Math.cos(tilt) });
    const angle = degrees((tilt * 180) / Math.PI + rotation);
    const corner = toPage(turn(-boxW / 2, -boxH / 2));
    pages[i].drawRectangle({ ...corner, width: boxW, height: boxH, rotate: angle, borderColor: rgb(r, g, b), borderWidth: Math.max(2, size / 10), opacity: 0.85, borderOpacity: 0.85 });
    let advance = 0;
    for (const seg of line.segments) {
      if (!/^ +$/.test(seg.text)) {
        pages[i].drawText(seg.text, { ...toPage(turn(-textW / 2 + advance, -size * 0.3)), size, font: book.font(seg.face, seg.script), color: rgb(r, g, b), opacity: 0.85, rotate: angle });
      }
      advance += book.width(seg.face, seg.script, seg.text, size);
    }
    onProgress?.(((i + 1) / last) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return { bytes: await doc.save(), replaced: book.replaced };
}
