// Opens a Word, Excel or PowerPoint file (they are zip files) and turns the text into blocks the PDF maker can draw.
import { listEntries, unpackEntries, zipFail } from '../../../shared/lib/zipRead.js';
import { docxBlocks } from './readDocx.js';
import { pptxBlocks } from './readPptx.js';
import { dateStyles, readSharedStrings, xlsxBlocks } from './readXlsx.js';
import { attr, blocksOf, utf8 } from './xmlText.js';

const LIMITS = { one: 80 * 1024 * 1024, total: 200 * 1024 * 1024 };
const MAX_SLIDES = 300;
const MAX_SHEETS = 50;

function relationships(xml) {
  return new Map(blocksOf(xml ?? '', 'Relationship').map((tag) => [attr(tag, 'Id'), attr(tag, 'Target') ?? '']));
}
const resolve = (base, target) => (target.startsWith('/') ? target.slice(1) : `${base}${target}`.replace(/[^/]+\/\.\.\//g, ''));

async function fileMap(bytes, wanted) {
  let entries;
  try {
    entries = listEntries(bytes).filter((e) => !e.name.endsWith('/'));
  } catch {
    throw zipFail('error.officeBad');
  }
  const chosen = entries.filter((e) => wanted(e.name));
  const files = await unpackEntries(bytes, chosen, LIMITS);
  return new Map(files.map((f) => [f.name, utf8(f.bytes)]));
}

// kind: 'docx' | 'xlsx' | 'pptx'. Returns { blocks, notes: [noteKey] }.
export async function readOffice(bytes, kind) {
  if (kind === 'docx') {
    const files = await fileMap(bytes, (n) => n === 'word/document.xml' || n === 'word/numbering.xml');
    if (!files.has('word/document.xml')) throw zipFail('error.officeBad');
    const { blocks } = docxBlocks(files.get('word/document.xml'), files.get('word/numbering.xml'));
    if (blocks.length === 0) throw zipFail('error.officeEmpty');
    return { blocks, notes: ['office.noteWord'] };
  }
  if (kind === 'xlsx') {
    const files = await fileMap(bytes, (n) => /^xl\/(workbook\.xml|_rels\/workbook\.xml\.rels|sharedStrings\.xml|styles\.xml|worksheets\/[^/]+\.xml)$/.test(n));
    const book = files.get('xl/workbook.xml');
    if (!book) throw zipFail('error.officeBad');
    const rels = relationships(files.get('xl/_rels/workbook.xml.rels'));
    const sheets = blocksOf(book, 'sheet').slice(0, MAX_SHEETS).map((tag) => ({ name: attr(tag, 'name') ?? 'Sheet', xml: files.get(resolve('xl/', rels.get(attr(tag, 'id')) ?? '')) })).filter((s) => s.xml);
    if (sheets.length === 0) throw zipFail('error.officeEmpty');
    const { blocks, cut } = xlsxBlocks(sheets, readSharedStrings(files.get('xl/sharedStrings.xml')), dateStyles(files.get('xl/styles.xml')));
    return { blocks, notes: cut ? ['office.noteExcel', 'office.noteCut'] : ['office.noteExcel'] };
  }
  const files = await fileMap(bytes, (n) => /^ppt\/(presentation\.xml|_rels\/presentation\.xml\.rels|slides\/slide\d+\.xml)$/.test(n));
  const rels = relationships(files.get('ppt/_rels/presentation.xml.rels'));
  let names = blocksOf(files.get('ppt/presentation.xml') ?? '', 'p:sldId').map((tag) => resolve('ppt/', rels.get(attr(tag, 'id')) ?? ''));
  names = names.filter((n) => files.has(n));
  if (names.length === 0) names = [...files.keys()].filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (names.length === 0) throw zipFail('error.officeEmpty');
  const { blocks } = pptxBlocks(names.slice(0, MAX_SLIDES).map((n) => files.get(n)));
  return { blocks, notes: ['office.notePpt'] };
}
