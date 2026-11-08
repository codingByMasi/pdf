// Writes page numbers on every page (top or bottom, left, middle or right), even on turned pages.
import { StandardFonts, rgb, degrees } from 'pdf-lib';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const SIZE = 12;
const EDGE = 28;
const SIDE = 36;

// options: { vertical: 'bottom'|'top', horizontal: 'left'|'center'|'right', style: 'simple'|'total', start: number, skipFirst: boolean }
export async function addNumbers(bytes, options, onProgress) {
  const doc = await loadPdf(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const skip = options.skipFirst ? 1 : 0;
  const start = Number.isFinite(options.start) ? Math.trunc(options.start) : 1;
  const last = start + pages.length - skip - 1;

  for (let i = skip; i < pages.length; i += 1) {
    const { shown, rotation, toPage } = pageGeometry(pages[i]);
    const n = start + i - skip;
    const label = options.style === 'total' ? `${n} / ${last}` : String(n);
    const width = font.widthOfTextAtSize(label, SIZE);
    const x = { left: SIDE, center: (shown.width - width) / 2, right: shown.width - SIDE - width }[options.horizontal];
    const y = options.vertical === 'top' ? shown.height - EDGE - SIZE * 0.8 : EDGE;
    pages[i].drawText(label, { ...toPage({ x, y }), size: SIZE, font, color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 20 === 19) await yieldToUi();
  }
  return doc.save();
}
