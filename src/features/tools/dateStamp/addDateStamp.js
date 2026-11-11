// Writes a stamp line (name, date, time) in one corner of the pages. Hindi letters work too.
import { rgb, degrees } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';

const EDGE = 26;
const SIDE = 32;

// options: { name, date, time, position: 'topLeft'|'topRight'|'bottomLeft'|'bottomRight', pages: 'all'|'first'|'last', size }. Returns { bytes, replaced }.
export async function addDateStamp(bytes, options, { loadBytes } = {}, onProgress) {
  const { name = '', date = '', time = '', position = 'bottomRight', pages: which = 'all', size = 11 } = options;
  const text = [name.trim(), date.trim(), time.trim()].filter(Boolean).join('   ');
  if (!text) throw Object.assign(new Error('no text'), { errorKey: 'error.dateStampEmpty' });
  const doc = await loadPdf(bytes);
  const book = await createFontBook(doc, { deva: hasDeva(text), loadBytes });
  const list = doc.getPages();
  const line = wrapPieces(book, [{ text: book.clean(text), face: 'regular' }], size, 1e9)[0];
  const targets = which === 'first' ? [0] : which === 'last' ? [list.length - 1] : list.map((_, i) => i);
  targets.forEach((index, n) => {
    const { shown, rotation, toPage } = pageGeometry(list[index]);
    let x = position.endsWith('Left') ? SIDE : shown.width - SIDE - line.width;
    const y = position.startsWith('top') ? shown.height - EDGE - size * 0.8 : EDGE;
    for (const seg of line.segments) {
      if (!/^ +$/.test(seg.text)) list[index].drawText(seg.text, { ...toPage({ x, y }), size, font: book.font(seg.face, seg.script), color: rgb(0.1, 0.1, 0.1), rotate: degrees(rotation) });
      x += book.width(seg.face, seg.script, seg.text, size);
    }
    onProgress?.(((n + 1) / targets.length) * 100);
  });
  return { bytes: await doc.save(), replaced: book.replaced };
}
