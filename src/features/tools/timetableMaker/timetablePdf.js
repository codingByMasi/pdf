// Draws a weekly timetable on A4 landscape: days down the side, periods across the top, a note in each square.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';

// d: { title, days: number of days (5 or 6), periods: number, cells: string[day][period], times: string[period], accent }. t: translate.
export async function timetablePdf(d, t, { loadBytes } = {}) {
  const accent = hexToRgb(d.accent);
  const all = d.cells.flat().concat(d.times, [d.title, t('cal.dFull.1'), t('timetable.period'), t('timetable.defaultTitle')]);
  return buildDoc(all, (c) => {
    c.write(d.title || t('timetable.defaultTitle'), { size: 22, face: 'bold', color: accent, after: 10 });
    const labelW = 70;
    const colW = (c.contentWidth - labelW) / d.periods;
    const headH = 34;
    const rowH = Math.min(70, (c.height - c.margin * 2 - 70 - headH) / d.days);
    const x0 = c.margin;
    const y0 = c.y;
    c.box(x0, y0 - headH, c.contentWidth, headH, { fill: accent });
    for (let p = 0; p < d.periods; p += 1) {
      const x = x0 + labelW + p * colW;
      c.textAt(`${t('timetable.period')} ${p + 1}${d.times[p] ? `\n${d.times[p]}` : ''}`, { x, y: y0 - 6, size: 9.5, face: 'bold', color: [1, 1, 1], width: colW, align: 'center', maxLines: 2, lineHeight: 1.25 });
    }
    for (let r = 0; r < d.days; r += 1) {
      const y = y0 - headH - r * rowH;
      c.box(x0, y - rowH, c.contentWidth, rowH, { stroke: [0.78, 0.8, 0.85], thickness: 0.7, fill: r % 2 ? [0.97, 0.97, 0.98] : [1, 1, 1] });
      c.textAt(t(`cal.dFull.${(r + 1) % 7}`), { x: x0 + 4, y: y - rowH / 2 + 6, size: 11, face: 'bold', color: SOFT, width: labelW - 8, maxLines: 1 });
      for (let p = 0; p < d.periods; p += 1) {
        const x = x0 + labelW + p * colW;
        c.line(x, y, x, y - rowH, { color: [0.78, 0.8, 0.85], thickness: 0.7 });
        const text = d.cells[r]?.[p] ?? '';
        const size = text.length > 24 ? 8.5 : 10.5;
        if (text) c.textAt(text, { x: x + 3, y: y - rowH / 2 + size, size, color: INK, width: colW - 6, align: 'center', maxLines: 4, lineHeight: 1.2 });
      }
    }
  }, { size: 'a4-landscape', margin: 36, loadBytes });
}
