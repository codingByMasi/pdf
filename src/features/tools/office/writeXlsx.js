// Writes a plain Excel (.xlsx) file: one sheet per PDF page, one row per text row, one cell per piece of text.
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { contentTypes, escapeXml, relsFile, xmlFile } from './xmlWrite.js';

const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

export function columnName(index) {
  let name = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
}

const isPlainNumber = (text) => /^-?(0|[1-9]\d{0,14})(\.\d{1,10})?$/.test(text);

function cell(text, ref) {
  if (isPlainNumber(text)) return `<c r="${ref}"><v>${text}</v></c>`;
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

// pages: [[[cell, cell], [cell]], ...] (rows of cells for each page). Returns the file bytes.
export function writeXlsx(pages, pageWord = 'Page') {
  const sheets = pages.length ? pages : [[]];
  const parts = [
    contentTypes([
      ['/xl/workbook.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'],
      ...sheets.map((_, i) => [`/xl/worksheets/sheet${i + 1}.xml`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml']),
    ]),
    relsFile('_rels/.rels', [['rId1', 'officeDocument', 'xl/workbook.xml']]),
    xmlFile('xl/workbook.xml', `<workbook xmlns="${S}" xmlns:r="${REL_NS}"><sheets>${sheets.map((_, i) => `<sheet name="${escapeXml(`${pageWord} ${i + 1}`)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`),
    relsFile('xl/_rels/workbook.xml.rels', sheets.map((_, i) => [`rId${i + 1}`, 'worksheet', `worksheets/sheet${i + 1}.xml`])),
  ];
  sheets.forEach((rows, i) => {
    const data = rows.map((cells, r) => `<row r="${r + 1}">${cells.map((text, c) => cell(text, `${columnName(c)}${r + 1}`)).join('')}</row>`).join('');
    parts.push(xmlFile(`xl/worksheets/sheet${i + 1}.xml`, `<worksheet xmlns="${S}"><sheetData>${data}</sheetData></worksheet>`));
  });
  return makeZip(parts);
}
