// Turns CSV text into JSON (list of objects) and JSON back into CSV.
import { parseCsv } from '../../../shared/lib/csvParse.js';

// Returns { ok, text } or { ok: false, errorKey }.
export function csvToJson(text, indent = 2) {
  const { rows, errorKey } = parseCsv(text);
  if (errorKey) return { ok: false, errorKey };
  if (rows.length === 0) return { ok: false, errorKey: 'csvjson.empty' };
  const [head, ...body] = rows;
  const names = head.map((cell, i) => (cell.trim() || `column${i + 1}`));
  const list = body.map((row) => Object.fromEntries(names.map((name, i) => [name, row[i] ?? ''])));
  return { ok: true, text: JSON.stringify(list, null, indent), count: list.length };
}

const quote = (value) => {
  const text = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// Accepts a list of objects, or a list of lists.
export function jsonToCsv(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, errorKey: 'csvjson.badJson' };
  }
  if (!Array.isArray(data) || data.length === 0) return { ok: false, errorKey: 'csvjson.notList' };
  if (data.every(Array.isArray)) return { ok: true, text: data.map((row) => row.map(quote).join(',')).join('\n'), count: data.length };
  const names = [];
  for (const item of data) {
    if (!item || typeof item !== 'object') return { ok: false, errorKey: 'csvjson.notList' };
    for (const key of Object.keys(item)) if (!names.includes(key)) names.push(key);
  }
  const lines = [names.map(quote).join(',')];
  for (const item of data) lines.push(names.map((name) => quote(item[name])).join(','));
  return { ok: true, text: lines.join('\n'), count: data.length };
}
