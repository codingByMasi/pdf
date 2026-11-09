// Draws visiting cards (90 x 50 mm): one sheet of ten (two columns, five rows) on A4, or a single card.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';

const MM = 72 / 25.4;
export const CARD = { w: 90 * MM, h: 50 * MM };

// d: { name, title, company, phone, email, website, address, accent, sheet: 'sheet' | 'one' }
function drawCard(c, d, x, y) {
  const accent = hexToRgb(d.accent);
  c.box(x, y, CARD.w, CARD.h, { fill: [1, 1, 1], stroke: [0.85, 0.86, 0.9], thickness: 0.5 });
  c.box(x, y, 8, CARD.h, { fill: accent });
  const left = x + 22;
  const width = CARD.w - 34;
  let top = y + CARD.h - 14;
  top -= c.textAt(d.name, { x: left, y: top, size: 15, face: 'bold', width, maxLines: 2 }) + 1;
  if (d.title) top -= c.textAt(d.title, { x: left, y: top, size: 9.5, color: SOFT, width, maxLines: 2 });
  if (d.company) top -= c.textAt(d.company, { x: left, y: top, size: 10, face: 'bold', color: accent, width, maxLines: 2 });
  const lines = [d.phone, d.email, d.website, d.address].filter(Boolean).join('\n');
  c.textAt(lines, { x: left, y: y + 12 + Math.min(4, lines.split('\n').length) * 11.5, size: 8.5, color: INK, width, maxLines: 5, lineHeight: 1.35 });
}

export async function cardPdf(d, { loadBytes } = {}) {
  return buildDoc([d.name, d.title, d.company, d.address, '₹'], (c) => {
    const one = d.sheet === 'one';
    const cols = one ? 1 : 2;
    const rows = one ? 1 : 5;
    const gapX = 0;
    const startX = (c.width - cols * CARD.w - (cols - 1) * gapX) / 2;
    const startY = c.height - (c.height - rows * CARD.h) / 2 - CARD.h;
    for (let r = 0; r < rows; r += 1) for (let k = 0; k < cols; k += 1) drawCard(c, d, startX + k * (CARD.w + gapX), startY - r * CARD.h);
  }, { margin: 20, loadBytes });
}
