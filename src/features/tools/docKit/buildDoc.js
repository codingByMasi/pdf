// Starts a PDF for the document makers: fonts (English and Hindi), a page writer, and easy drawing helpers.
import { rgb } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { createPageWriter } from '../../../shared/lib/pageWriter.js';
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';

export const INK = [0.1, 0.1, 0.12];
export const SOFT = [0.4, 0.42, 0.48];
export const hexToRgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return INK;
  const n = parseInt(m[1], 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const colour = (c) => rgb(c[0], c[1], c[2]);

// Wraps one paragraph; empty text gives one empty line.
function layout(book, text, face, size, width) {
  return text.split('\n').flatMap((part) => (part.trim() === '' ? [{ segments: [], width: 0, blank: true }] : wrapPieces(book, [{ text: part, face }], size, width)));
}

function drawSegments(page, book, line, x, baseline, size, color) {
  let cursor = x;
  for (const seg of line.segments) {
    if (!/^ +$/.test(seg.text)) page.drawText(seg.text, { x: cursor, y: baseline, size, font: book.font(seg.face, seg.script), color: colour(color) });
    cursor += book.width(seg.face, seg.script, seg.text, size);
  }
}

// texts: every piece of text the document will show (used to decide if the Hindi font is needed).
// draw(ctx) does the drawing. size: 'a4' | 'a4-landscape'.
export async function buildDoc(texts, draw, { size = 'a4', margin = 48, loadBytes } = {}) {
  const doc = await createPdf();
  const book = await createFontBook(doc, { deva: hasDeva(texts.join('\n')), bold: true, loadBytes });
  const writer = createPageWriter(doc, book, { size, margin, maxPages: 400 });
  writer.newPage();
  const ctx = {
    doc, book, writer,
    get page() { return writer.page; },
    width: writer.width, height: writer.height, margin, contentWidth: writer.contentWidth,
    get y() { return writer.y; },
    set y(v) { writer.y = v; },
    newPage: () => writer.newPage(),
    gap: (n) => { writer.y -= n; },
    clean: (t) => book.clean(String(t ?? '')),
    // Measures wrapped text: { lines, height }.
    measure(text, { size = 11, face = 'regular', width = writer.contentWidth, lineHeight = 1.4 } = {}) {
      const lines = layout(book, book.clean(String(text ?? '')), face, size, width);
      return { lines, height: lines.length * size * lineHeight };
    },
    // Flow text at the cursor, moving down. align: left | center | right.
    write(text, { size = 11, face = 'regular', color = INK, align = 'left', x = margin, width = writer.contentWidth, lineHeight = 1.4, after = 0 } = {}) {
      const { lines } = ctx.measure(text, { size, face, width, lineHeight });
      for (const line of lines) {
        writer.ensure(size * lineHeight);
        const left = align === 'center' ? x + (width - line.width) / 2 : align === 'right' ? x + width - line.width : x;
        drawSegments(writer.page, book, line, left, writer.y - size * 1.05 - (size * lineHeight - size * 1.2) / 2, size, color);
        writer.y -= size * lineHeight;
      }
      writer.y -= after;
    },
    // Text at a fixed place: top edge at y (from the page bottom). Returns the height used.
    textAt(text, { x, y, size = 11, face = 'regular', color = INK, align = 'left', width = 400, lineHeight = 1.3, page = writer.page, maxLines = 99 }) {
      const lines = layout(book, book.clean(String(text ?? '')), face, size, width).slice(0, maxLines);
      lines.forEach((line, i) => {
        const left = align === 'center' ? x + (width - line.width) / 2 : align === 'right' ? x + width - line.width : x;
        drawSegments(page, book, line, left, y - size * 1.05 - i * size * lineHeight, size, color);
      });
      return lines.length * size * lineHeight;
    },
    rule({ color = [0.8, 0.82, 0.86], thickness = 0.8, x = margin, width = writer.contentWidth } = {}) {
      writer.ensure(thickness + 2);
      writer.page.drawLine({ start: { x, y: writer.y }, end: { x: x + width, y: writer.y }, thickness, color: colour(color) });
    },
    box(x, y, w, h, { fill = null, stroke = null, thickness = 0.8, page = writer.page } = {}) {
      page.drawRectangle({ x, y, width: w, height: h, color: fill ? colour(fill) : undefined, borderColor: stroke ? colour(stroke) : undefined, borderWidth: stroke ? thickness : 0 });
    },
    line(x1, y1, x2, y2, { color = [0.8, 0.82, 0.86], thickness = 0.8, page = writer.page } = {}) {
      page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color: colour(color) });
    },
    // Table in flow: cols [{ width (share), align }]. rows: arrays of text. First row is a header when header is true.
    table(rows, cols, { size = 10, header = true, headFill = [0.94, 0.95, 0.97], pad = 5 } = {}) {
      const total = cols.reduce((a, c) => a + c.width, 0);
      const widths = cols.map((c) => (c.width / total) * writer.contentWidth);
      rows.forEach((row, r) => {
        const head = header && r === 0;
        const face = head ? 'bold' : 'regular';
        const cells = widths.map((w, c) => layout(book, book.clean(String(row[c] ?? '')), face, size, w - 2 * pad));
        const rowHeight = Math.max(...cells.map((l) => l.length)) * size * 1.35 + 2 * pad;
        writer.ensure(rowHeight);
        const top = writer.y;
        if (head) ctx.box(margin, top - rowHeight, writer.contentWidth, rowHeight, { fill: headFill });
        let x = margin;
        cells.forEach((lines, c) => {
          lines.forEach((line, i) => {
            const left = cols[c].align === 'right' ? x + widths[c] - pad - line.width : x + pad;
            drawSegments(writer.page, book, line, left, top - pad - size * 1.05 - i * size * 1.35, size, head ? INK : INK);
          });
          x += widths[c];
        });
        writer.y -= rowHeight;
        ctx.line(margin, writer.y, margin + writer.contentWidth, writer.y);
      });
    },
  };
  await draw(ctx);
  return { bytes: await doc.save(), replaced: book.replaced };
}
