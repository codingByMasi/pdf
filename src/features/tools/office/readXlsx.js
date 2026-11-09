// Reads the cell values of an Excel (.xlsx) file into one table per sheet. Formulas show their last saved result.
import { attr, blocksOf, decodeXml, textsOf } from './xmlText.js';

const MAX_ROWS = 3000;
const MAX_COLUMNS = 20;
const BUILTIN_DATES = new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 45, 46, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58]);

export function columnIndex(ref) {
  const letters = /^[A-Z]+/i.exec(ref)?.[0].toUpperCase() ?? 'A';
  return [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
}

export function readSharedStrings(xml) {
  return xml ? blocksOf(xml, 'si').map((si) => textsOf(si.replace(/<rPh[\s\S]*?<\/rPh>/g, ''), 't')) : [];
}

// Which cell style numbers are dates: returns a Set of style indexes.
export function dateStyles(xml) {
  const dates = new Set();
  if (!xml) return dates;
  const custom = new Map(blocksOf(xml, 'numFmt').map((tag) => [attr(tag, 'numFmtId'), attr(tag, 'formatCode') ?? '']));
  const cellXfs = /<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/.exec(xml)?.[1] ?? '';
  blocksOf(cellXfs, 'xf').forEach((xf, index) => {
    const id = attr(xf, 'numFmtId');
    const code = custom.get(id);
    const isDate = code !== undefined ? /[dmyhs]/i.test(code.replace(/"[^"]*"|\[[^\]]*\]|\\./g, '')) && !/^0|#/.test(code) : BUILTIN_DATES.has(Number(id));
    if (isDate) dates.add(index);
  });
  return dates;
}

function serialToDate(serial) {
  const ms = Math.round((serial - 25569) * 86400000);
  const d = new Date(ms);
  const date = d.toISOString().slice(0, 10);
  return serial % 1 === 0 ? date : `${date} ${d.toISOString().slice(11, 16)}`;
}

function tidyNumber(value) {
  return /^-?\d+\.\d{9,}$/.test(value) || /e/i.test(value) ? String(Number(Number(value).toPrecision(12))) : value;
}

// sheetXml: one worksheet. Returns { rows, cut } where cut tells if rows or columns were dropped.
export function sheetRows(xml, strings, dates) {
  const rows = [];
  let cut = false;
  for (const rowXml of blocksOf(xml, 'row')) {
    const row = [];
    const cellRe = /<c(?=[\s>])([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    for (let m = cellRe.exec(rowXml); m; m = cellRe.exec(rowXml)) {
      const tag = `<c ${m[1]}>`;
      const col = columnIndex(attr(tag, 'r') ?? 'A');
      if (col >= MAX_COLUMNS) { cut = true; continue; }
      const type = attr(tag, 't');
      const inner = m[2] ?? '';
      const raw = /<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? '';
      let value = '';
      if (type === 's') value = strings[Number(raw)] ?? '';
      else if (type === 'inlineStr') value = textsOf(inner, 't');
      else if (type === 'str' || type === 'e') value = decodeXml(raw);
      else if (type === 'b') value = raw === '1' ? 'TRUE' : 'FALSE';
      else if (raw !== '') value = dates.has(Number(attr(tag, 's'))) && Number.isFinite(Number(raw)) ? serialToDate(Number(raw)) : tidyNumber(raw);
      row[col] = value;
    }
    if (row.some((v) => v)) {
      rows.push(Array.from(row, (v) => v ?? ''));
      if (rows.length >= MAX_ROWS) { cut = true; break; }
    } else if (rows.length) rows.push([]);
  }
  while (rows.length && rows.at(-1).length === 0) rows.pop();
  const width = Math.max(1, ...rows.map((r) => r.length));
  return { rows: rows.map((r) => Array.from({ length: width }, (_, i) => r[i] ?? '')), cut };
}

// sheets: [{ name, xml }]. Returns { blocks, cut }.
export function xlsxBlocks(sheets, strings, dates) {
  const blocks = [];
  let cut = false;
  for (const sheet of sheets) {
    const { rows, cut: sheetCut } = sheetRows(sheet.xml, strings, dates);
    cut ||= sheetCut;
    blocks.push({ kind: 'heading', level: 2, runs: [{ text: sheet.name, bold: true }] });
    if (rows.length) blocks.push({ kind: 'table', rows });
  }
  return { blocks, cut };
}
