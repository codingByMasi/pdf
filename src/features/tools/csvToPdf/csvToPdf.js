// Turns CSV (spreadsheet text) into a PDF table, with the first row as a repeating header.
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { parseCsv } from '../../../shared/lib/csvParse.js';
import { createPageWriter } from '../../../shared/lib/pageWriter.js';
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { drawTable } from '../../../shared/lib/tableDraw.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const MAX_COLUMNS = 40;

function fail(errorKey) {
  return Object.assign(new Error(errorKey), { errorKey });
}

// Returns { bytes, replaced }.
export async function csvToPdf(text, { loadBytes } = {}, onProgress) {
  const parsed = parseCsv(text);
  if (parsed.errorKey) throw fail(parsed.errorKey);
  if (parsed.rows.length === 0) throw fail('error.textEmpty');
  const columns = Math.max(...parsed.rows.map((row) => row.length));
  if (columns > MAX_COLUMNS) throw fail('error.csvTooWide');

  const doc = await createPdf();
  const book = await createFontBook(doc, { deva: hasDeva(text), bold: true, loadBytes });
  const rows = parsed.rows.map((row) => Array.from({ length: columns }, (_, c) => book.clean(row[c] ?? '')));
  const size = columns > 5 ? 'a4-landscape' : 'a4';
  const writer = createPageWriter(doc, book, { size, margin: 36 });
  const fitted = await drawTable(writer, book, rows, { onProgress, yieldToUi });
  if (!fitted) throw fail('error.csvTooWide');
  return { bytes: await doc.save(), replaced: book.replaced };
}
