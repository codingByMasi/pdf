// Tests for writing Word, Excel and PowerPoint files and for grouping PDF text into rows. Files are read back with our own reader.
import { describe, expect, it } from 'vitest';
import { rowsFromItems } from './pdfRows.js';
import { readOffice } from './readOffice.js';
import { writeDocx } from './writeDocx.js';
import { columnName, writeXlsx } from './writeXlsx.js';
import { writePptx } from './writePptx.js';

const item = (str, x, y, width = str.length * 6, height = 12) => ({ str, transform: [12, 0, 0, 12, x, y], width, height });
const text = (b) => (b.runs ?? []).map((r) => r.text).join('');

describe('rowsFromItems', () => {
  it('puts pieces on the same line into one row and splits wide gaps into cells', () => {
    const rows = rowsFromItems([item('Name', 50, 700), item('Marks', 200, 700), item('Asha', 50, 680), item('91', 200, 680), item('Title', 50, 740)]);
    expect(rows).toEqual([['Title'], ['Name', 'Marks'], ['Asha', '91']]);
  });
  it('joins nearby pieces into one cell', () => {
    expect(rowsFromItems([item('Hello', 50, 700), item('world', 84, 700)])).toEqual([['Hello world']]);
  });
  it('ignores blank pieces', () => {
    expect(rowsFromItems([item('  ', 50, 700)])).toEqual([]);
  });
});

describe('writers', () => {
  it('writes a docx we can read back, with special letters and page breaks', async () => {
    const { blocks } = await readOffice(writeDocx([['Hello & <you>', 'नमस्ते'], ['Page two']]), 'docx');
    expect(blocks.map(text).filter(Boolean)).toEqual(['Hello & <you>', 'नमस्ते', 'Page two']);
  });
  it('writes an xlsx with numbers kept as numbers and text kept as text', async () => {
    const { blocks } = await readOffice(writeXlsx([[['Item', 'Qty'], ['Pen', '12'], ['007', '1.5']]]), 'xlsx');
    expect(blocks[1].rows).toEqual([['Item', 'Qty'], ['Pen', '12'], ['007', '1.5']]);
  });
  it('names spreadsheet columns', () => {
    expect([0, 25, 26, 701].map(columnName)).toEqual(['A', 'Z', 'AA', 'ZZ']);
  });
  it('writes a pptx with one slide per page', async () => {
    const { blocks } = await readOffice(writePptx([{ title: 'Page 1', lines: ['a', 'b'] }, { title: 'Page 2', lines: ['c'] }]), 'pptx');
    expect(blocks.map(text).filter(Boolean)).toEqual(['Slide 1', 'Page 1', 'a', 'b', 'Slide 2', 'Page 2', 'c']);
  });
});
