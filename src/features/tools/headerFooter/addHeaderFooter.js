// Writes a header and a footer on every page. {page} and {pages} become the page number and the page count.
import { rgb, degrees } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const SIZE = 10;
const EDGE = 28;
const SIDE = 36;

export function fillTokens(text, page, pages) {
  return text.replace(/\{page\}/gi, String(page)).replace(/\{pages\}/gi, String(pages));
}

// options: { header, footer, align: 'left'|'center'|'right', skipFirst }. Returns { bytes, replaced }.
export async function addHeaderFooter(bytes, options, { loadBytes } = {}, onProgress) {
  const { header = '', footer = '', align = 'center', skipFirst = false } = options;
  if (!header.trim() && !footer.trim()) throw Object.assign(new Error('no text'), { errorKey: 'error.headerEmpty' });
  const doc = await loadPdf(bytes);
  const book = await createFontBook(doc, { deva: hasDeva(header + footer), loadBytes });
  const pages = doc.getPages();

  for (let i = skipFirst ? 1 : 0; i < pages.length; i += 1) {
    const { shown, rotation, toPage } = pageGeometry(pages[i]);
    for (const [raw, top] of [[header, true], [footer, false]]) {
      if (!raw.trim()) continue;
      const text = book.clean(fillTokens(raw.replace(/\s+/g, ' ').trim(), i + 1, pages.length));
      const line = wrapPieces(book, [{ text, face: 'regular' }], SIZE, 1e9)[0];
      const width = line.width;
      let x = { left: SIDE, center: (shown.width - width) / 2, right: shown.width - SIDE - width }[align];
      const y = top ? shown.height - EDGE - SIZE * 0.8 : EDGE;
      for (const seg of line.segments) {
        if (!/^ +$/.test(seg.text)) {
          pages[i].drawText(seg.text, { ...toPage({ x, y }), size: SIZE, font: book.font(seg.face, seg.script), color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
        }
        x += book.width(seg.face, seg.script, seg.text, SIZE);
      }
    }
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return { bytes: await doc.save(), replaced: book.replaced };
}
