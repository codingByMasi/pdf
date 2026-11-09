// Draws a QR code on the pages. Each run of dark squares becomes one small box, so the code stays sharp when printed.
import { rgb } from 'pdf-lib';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { makeQr } from '../../../shared/lib/qr/qrMatrix.js';

export const QR_SIZES = { small: 70, medium: 100, large: 140 };

// options: { text, size: 'small'|'medium'|'large', place: 'tl'|'tr'|'bl'|'br'|'centre', pages: 'all'|'first', level }
export async function addQr(bytes, { text, size = 'medium', place = 'br', pages: which = 'all', level = 'M' }, onProgress) {
  const grid = makeQr(text, level);
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  const last = which === 'first' ? 1 : pages.length;
  const quiet = 2;
  const modules = grid.length + quiet * 2;
  const total = QR_SIZES[size] ?? QR_SIZES.medium;
  const cell = total / modules;

  for (let i = 0; i < last; i += 1) {
    const box = pages[i].getCropBox();
    const edge = 18;
    const x0 = place.endsWith('l') ? box.x + edge : place === 'centre' ? box.x + (box.width - total) / 2 : box.x + box.width - total - edge;
    const y0 = place.startsWith('b') ? box.y + edge : place === 'centre' ? box.y + (box.height - total) / 2 : box.y + box.height - total - edge;
    pages[i].drawRectangle({ x: x0, y: y0, width: total, height: total, color: rgb(1, 1, 1) });
    grid.forEach((row, r) => {
      for (let c = 0; c < row.length; c += 1) {
        if (!row[c]) continue;
        let end = c;
        while (end + 1 < row.length && row[end + 1]) end += 1;
        pages[i].drawRectangle({ x: x0 + (c + quiet) * cell, y: y0 + total - (r + quiet + 1) * cell, width: (end - c + 1) * cell + 0.2, height: cell + 0.2, color: rgb(0, 0, 0) });
        c = end;
      }
    });
    onProgress?.(((i + 1) / last) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return doc.save();
}
