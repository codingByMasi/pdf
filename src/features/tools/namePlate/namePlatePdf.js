// Draws a desk or door name plate on A4 landscape: a big name, a small line below it and a coloured band.
import { SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';

// d: { name, line, accent }
export async function namePlatePdf(d, { loadBytes } = {}) {
  const accent = hexToRgb(d.accent);
  return buildDoc([d.name, d.line], (c) => {
    const { width: w, height: h } = c;
    c.box(0, h - 70, w, 70, { fill: accent });
    c.box(0, 0, w, 36, { fill: accent });
    const inner = w - 120;
    let size = 90;
    while (size > 24 && c.measure(d.name, { size, face: 'bold', width: inner }).lines.length > 1) size -= 4;
    const used = c.measure(d.name, { size, face: 'bold', width: inner }).height;
    let y = h / 2 + used / 2 + 10;
    y -= c.textAt(d.name, { x: 60, y, size, face: 'bold', align: 'center', width: inner, maxLines: 2 }) + 12;
    if (d.line) c.textAt(d.line, { x: 60, y, size: 28, color: SOFT, align: 'center', width: inner, maxLines: 2 });
  }, { size: 'a4-landscape', margin: 40, loadBytes });
}
