// Turns the text rows of a PDF into CSV text (rough: guesses the columns from the gaps between words).
import { rowsFromItems } from '../office/pdfRows.js';

const quote = (cell) => (/[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell);

// pages: one list of text pieces per page. Rows with only one cell are skipped when onlyTables is on.
export function pagesToCsv(pages, { onlyTables = true } = {}) {
  const blocks = pages.map((items) => rowsFromItems(items).filter((cells) => !onlyTables || cells.length > 1).map((cells) => cells.map(quote).join(',')));
  const kept = blocks.filter((rows) => rows.length > 0);
  // A BOM first, so Excel opens Hindi letters correctly.
  return `﻿${kept.map((rows) => rows.join('\r\n')).join('\r\n\r\n')}`;
}
