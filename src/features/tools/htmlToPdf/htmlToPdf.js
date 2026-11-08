// Draws the simple blocks from an HTML page (headings, paragraphs, lists, tables) into a PDF.
import { rgb } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { createPageWriter } from '../../../shared/lib/pageWriter.js';
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { drawTable } from '../../../shared/lib/tableDraw.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces, wrapText } from '../../../shared/lib/textWrap.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const BODY = 11;
const HEADING = { 1: 24, 2: 19, 3: 16, 4: 14, 5: 12.5, 6: 11.5 };
const INDENT = 20;
const ink = rgb(0.1, 0.1, 0.1);

function fail(errorKey) {
  return Object.assign(new Error(errorKey), { errorKey });
}

function blockText(block) {
  if (block.kind === 'table') return block.rows.flat().join(' ');
  if (block.kind === 'pre') return block.text;
  return (block.runs ?? []).map((run) => run.text).join('');
}

// Splits runs at line breaks into groups of pieces, one group per line.
function lineGroups(runs, book) {
  const groups = [[]];
  for (const run of runs) {
    run.text.split('\n').forEach((part, i) => {
      if (i > 0) groups.push([]);
      if (part) groups.at(-1).push({ text: book.clean(part), face: run.bold ? 'bold' : 'regular' });
    });
  }
  return groups;
}

function space(writer, amount) {
  if (writer.page) writer.y -= amount;
}

function drawText(writer, book, block) {
  const heading = block.kind === 'heading';
  const size = heading ? HEADING[block.level] : BODY;
  const x = writer.margin + (block.kind === 'item' ? INDENT * (block.depth + 1) : 0) + (block.quote ? INDENT : 0);
  const width = writer.width - writer.margin - x;
  if (heading) space(writer, size * 0.6);
  let first = true;
  for (const pieces of lineGroups(block.runs, book)) {
    const lines = wrapPieces(book, pieces.length ? pieces : [{ text: '', face: 'regular' }], size, width);
    for (const line of lines) {
      if (first && block.kind === 'item') {
        writer.ensure(size * 1.4);
        writer.page.drawText(block.marker, { x: x - 14 - (block.marker.length > 1 ? 6 : 0), y: writer.y - size * 1.05, size, font: book.font('regular', 'latin'), color: ink });
      }
      writer.drawLine(line, { x, fontSize: size, color: ink, lineHeight: heading ? 1.25 : 1.4 });
      first = false;
    }
  }
  space(writer, heading ? size * 0.3 : size * 0.5);
}

function drawPre(writer, book, block) {
  const size = BODY - 1;
  for (const line of wrapText(book, book.clean(block.text), 'regular', size, writer.contentWidth)) {
    if (line.segments.length === 0) {
      writer.ensure(size * 1.3);
      writer.y -= size * 1.3;
    } else writer.drawLine(line, { fontSize: size, lineHeight: 1.3, color: ink });
  }
  space(writer, size * 0.6);
}

// blocks come from htmlToBlocks. Returns { bytes, replaced }.
export async function htmlToPdf(blocks, { loadBytes } = {}, onProgress) {
  const all = blocks.map(blockText).join(' ');
  if (all.trim() === '') throw fail('error.htmlEmpty');
  const doc = await createPdf();
  const book = await createFontBook(doc, { deva: hasDeva(all), bold: true, loadBytes });
  const writer = createPageWriter(doc, book, { size: 'a4' });

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.kind === 'rule') {
      writer.ensure(12);
      writer.page.drawLine({ start: { x: writer.margin, y: writer.y - 6 }, end: { x: writer.width - writer.margin, y: writer.y - 6 }, thickness: 0.8, color: rgb(0.6, 0.6, 0.6) });
      writer.y -= 14;
    } else if (block.kind === 'table') {
      const rows = block.rows.map((row) => row.map((cell) => book.clean(cell)));
      space(writer, 4);
      if (!(await drawTable(writer, book, rows, { yieldToUi }))) throw fail('error.csvTooWide');
      space(writer, 10);
    } else if (block.kind === 'pre') drawPre(writer, book, block);
    else drawText(writer, book, block);
    onProgress?.(((i + 1) / blocks.length) * 100);
    if (i % 100 === 99) await yieldToUi();
  }
  return { bytes: await doc.save(), replaced: book.replaced };
}
