// Draws a table (rows of text cells) over as many pages as needed. The first row is a bold header.
import { rgb } from 'pdf-lib';
import { wrapText } from './textWrap.js';

const FONT = 9.5;
const PAD = 4;
const LINE = 1.3;
const MAX_CELL_LINES = 30;
const MIN_COL = 34;
const MAX_COL = 240;
const SAMPLE_ROWS = 300;

function plainWidth(book, text, face, size) {
  return Math.max(...text.split('\n').map((part) => wrapText(book, part, face, size, 1e6)[0].width), 0);
}

// Gives every column a width that fits the page. Returns null if the columns cannot fit at all.
export function columnWidths(book, rows, avail) {
  const count = Math.max(...rows.map((row) => row.length));
  const wants = [];
  for (let c = 0; c < count; c += 1) {
    let widest = 0;
    rows.slice(0, SAMPLE_ROWS).forEach((row, r) => {
      widest = Math.max(widest, plainWidth(book, row[c] ?? '', r === 0 ? 'bold' : 'regular', FONT));
    });
    wants.push(Math.min(MAX_COL, Math.max(MIN_COL, widest + 2 * PAD)));
  }
  const total = wants.reduce((a, b) => a + b, 0);
  if (total <= avail) return wants.map((w) => w * Math.min(1.4, avail / total));
  if (count * MIN_COL > avail) return null;
  const spare = avail - count * MIN_COL;
  const extra = wants.map((w) => w - MIN_COL);
  const extraTotal = extra.reduce((a, b) => a + b, 0) || 1;
  return wants.map((_, c) => MIN_COL + (extra[c] / extraTotal) * spare);
}

function layoutRow(book, row, widths, face) {
  const cells = widths.map((w, c) => {
    const lines = wrapText(book, row[c] ?? '', face, FONT, w - 2 * PAD);
    return lines.length > MAX_CELL_LINES ? lines.slice(0, MAX_CELL_LINES) : lines;
  });
  const count = Math.max(...cells.map((lines) => lines.length));
  return { cells, height: count * FONT * LINE + 2 * PAD };
}

// writer comes from createPageWriter. rows[0] is the header. Returns false if the columns do not fit.
export async function drawTable(writer, book, rows, { onProgress, yieldToUi } = {}) {
  const widths = columnWidths(book, rows, writer.contentWidth);
  if (!widths) return false;
  const total = widths.reduce((a, b) => a + b, 0);
  const grey = rgb(0.87, 0.87, 0.87);
  const ink = rgb(0.1, 0.1, 0.1);
  const header = layoutRow(book, rows[0], widths, 'bold');

  function drawRow(laid, face, fill) {
    const top = writer.y;
    const { page } = writer;
    const bottom = top - laid.height;
    if (fill) page.drawRectangle({ x: writer.margin, y: bottom, width: total, height: laid.height, color: fill });
    page.drawLine({ start: { x: writer.margin, y: bottom }, end: { x: writer.margin + total, y: bottom }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
    let x = writer.margin;
    laid.cells.forEach((lines, c) => {
      writer.y = top - PAD;
      for (const line of lines) {
        let cursor = x + PAD;
        const baseline = writer.y - FONT;
        for (const seg of line.segments) {
          if (!/^ +$/.test(seg.text)) page.drawText(seg.text, { x: cursor, y: baseline, size: FONT, font: book.font(face, seg.script), color: ink });
          cursor += book.width(face, seg.script, seg.text, FONT);
        }
        writer.y -= FONT * LINE;
      }
      x += widths[c];
    });
    let lineX = writer.margin;
    for (let c = 0; c <= widths.length; c += 1) {
      page.drawLine({ start: { x: lineX, y: top }, end: { x: lineX, y: bottom }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
      lineX += widths[c] ?? 0;
    }
    writer.y = bottom;
  }

  function drawHeader() {
    writer.page.drawLine({ start: { x: writer.margin, y: writer.y }, end: { x: writer.margin + total, y: writer.y }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
    drawRow(header, 'bold', grey);
  }

  function startPage() {
    writer.newPage();
    drawHeader();
  }

  if (!writer.page || writer.y - header.height - 30 < writer.margin) startPage();
  else drawHeader();
  for (let r = 1; r < rows.length; r += 1) {
    const laid = layoutRow(book, rows[r], widths, 'regular');
    if (writer.y - laid.height < writer.margin) startPage();
    drawRow(laid, 'regular');
    onProgress?.((r / rows.length) * 100);
    if (r % 200 === 0) await yieldToUi?.();
  }
  return true;
}
