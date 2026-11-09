// Writes page numbers on every page (top or bottom, left, middle or right), even on turned pages.
import { StandardFonts, rgb, degrees } from 'pdf-lib';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';

const SIZE = 12;
const EDGE = 28;
const SIDE = 36;

const ROMAN = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];

// Writes a number in the chosen digits: 'latin' (1, 2), 'hindi' (१, २) or 'roman' (i, ii; numbers below 1 stay as they are).
export function formatNumber(n, digits = 'latin') {
  if (digits === 'hindi') return String(n).replace(/\d/g, (d) => String.fromCharCode(0x966 + Number(d)));
  if (digits === 'roman' && n >= 1 && n < 4000) {
    let rest = n;
    return ROMAN.reduce((out, [value, letters]) => { while (rest >= value) { out += letters; rest -= value; } return out; }, '');
  }
  return String(n);
}

// options: { vertical: 'bottom'|'top', horizontal: 'left'|'center'|'right', style: 'simple'|'total', start: number, skipFirst: boolean, digits: 'latin'|'hindi'|'roman' }
export async function addNumbers(bytes, options, onProgress) {
  const doc = await loadPdf(bytes);
  const hindi = options.digits === 'hindi';
  const book = hindi ? await createFontBook(doc, { deva: true }) : null;
  const font = hindi ? null : await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const skip = options.skipFirst ? 1 : 0;
  const start = Number.isFinite(options.start) ? Math.trunc(options.start) : 1;
  const last = start + pages.length - skip - 1;

  for (let i = skip; i < pages.length; i += 1) {
    const { shown, rotation, toPage } = pageGeometry(pages[i]);
    const n = start + i - skip;
    const f = (v) => formatNumber(v, options.digits);
    const label = options.style === 'total' ? `${f(n)} / ${f(last)}` : f(n);
    const line = hindi ? wrapPieces(book, [{ text: label, face: 'regular' }], SIZE, 1e9)[0] : null;
    const width = hindi ? line.width : font.widthOfTextAtSize(label, SIZE);
    const x = { left: SIDE, center: (shown.width - width) / 2, right: shown.width - SIDE - width }[options.horizontal];
    const y = options.vertical === 'top' ? shown.height - EDGE - SIZE * 0.8 : EDGE;
    if (hindi) {
      let at = x;
      for (const seg of line.segments) {
        if (!/^ +$/.test(seg.text)) pages[i].drawText(seg.text, { ...toPage({ x: at, y }), size: SIZE, font: book.font(seg.face, seg.script), color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
        at += book.width(seg.face, seg.script, seg.text, SIZE);
      }
    } else {
      pages[i].drawText(label, { ...toPage({ x, y }), size: SIZE, font, color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
    }
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 20 === 19) await yieldToUi();
  }
  return doc.save();
}
