// Reads CSV text into rows of cells. Handles quotes, commas, semicolons, tabs and blank lines.
const MAX_ROWS = 50000;

function pickDelimiter(text) {
  const firstLine = text.split('\n', 1)[0];
  let best = ',';
  let bestCount = 0;
  for (const mark of [',', ';', '\t', '|']) {
    const count = firstLine.split(mark).length - 1;
    if (count > bestCount) {
      best = mark;
      bestCount = count;
    }
  }
  return best;
}

// Returns { rows } or { errorKey } when there are too many rows.
export function parseCsv(input) {
  const text = input.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const delimiter = pickDelimiter(text);
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  const endRow = () => {
    row.push(cell);
    cell = '';
    if (row.some((value) => value.trim() !== '')) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && cell === '') quoted = true;
    else if (char === delimiter) {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      endRow();
      if (rows.length > MAX_ROWS) return { errorKey: 'error.csvTooLong' };
    } else cell += char;
  }
  endRow();
  if (rows.length > MAX_ROWS) return { errorKey: 'error.csvTooLong' };
  return { rows };
}
