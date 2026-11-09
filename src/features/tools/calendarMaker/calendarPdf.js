// Draws a calendar PDF: a whole year on one page (12 small months) or one big month with room to write.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';
import { dayOrder, monthWeeks } from './calendarMath.js';

// d: { mode: 'year' | 'month', year, month, startDay, accent }. t: translate function of the calendar's language.
function drawMonth(c, d, t, year, month, x, y, w, h, { big }) {
  const accent = hexToRgb(d.accent);
  const order = dayOrder(d.startDay);
  const head = big ? 26 : 14;
  c.textAt(`${t(`cal.m.${month}`)} ${year}`, { x, y, size: big ? 24 : 11, face: 'bold', color: accent, width: w, align: big ? 'center' : 'left' });
  const top = y - head - (big ? 14 : 4);
  const cell = w / 7;
  order.forEach((day, i) => c.textAt(t(`cal.d.${day}`), { x: x + i * cell, y: top, size: big ? 12 : 7, face: 'bold', color: day === 0 ? [0.75, 0.15, 0.15] : SOFT, width: cell, align: 'center' }));
  const weeks = monthWeeks(year, month, d.startDay);
  const rowH = big ? (h - head - 50) / 6 : (h - head - 14) / 6;
  weeks.forEach((week, r) => week.forEach((day, i) => {
    const cx = x + i * cell;
    const cy = top - (big ? 20 : 12) - r * rowH;
    if (big) c.box(cx, cy - rowH, cell, rowH, { stroke: [0.8, 0.82, 0.86], thickness: 0.6 });
    if (day) c.textAt(String(day), { x: big ? cx + 6 : cx, y: big ? cy - 5 : cy, size: big ? 15 : 8, color: order[i] === 0 ? [0.75, 0.15, 0.15] : INK, width: big ? cell - 8 : cell, align: big ? 'left' : 'center' });
  }));
}

export async function calendarPdf(d, t, { loadBytes } = {}) {
  const year = Number(d.year);
  return buildDoc([t('cal.m.1'), t('cal.d.0')], (c) => {
    if (d.mode === 'month') {
      drawMonth(c, d, t, year, Number(d.month), 40, c.height - 40, c.width - 80, c.height - 80, { big: true });
      return;
    }
    c.textAt(String(year), { x: 0, y: c.height - 30, size: 28, face: 'bold', color: hexToRgb(d.accent), align: 'center', width: c.width });
    const cols = 3;
    const cellW = (c.width - 80) / cols;
    const cellH = (c.height - 110) / 4;
    for (let m = 1; m <= 12; m += 1) {
      const col = (m - 1) % cols;
      const row = Math.floor((m - 1) / cols);
      drawMonth(c, d, t, year, m, 40 + col * cellW + 6, c.height - 80 - row * cellH, cellW - 12, cellH - 10, { big: false });
    }
  }, { size: d.mode === 'month' ? 'a4-landscape' : 'a4', margin: 30, loadBytes });
}
