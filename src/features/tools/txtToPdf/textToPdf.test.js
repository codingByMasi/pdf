// Tests for TXT, CSV and HTML to PDF: pages, Hindi fonts and friendly errors.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { csvToPdf } from '../csvToPdf/csvToPdf.js';
import { htmlToPdf } from '../htmlToPdf/htmlToPdf.js';
import { textToPdf } from './textToPdf.js';

const opts = { loadBytes: loadTestFont };

async function pages(bytes) {
  return (await PDFDocument.load(bytes)).getPageCount();
}

describe('textToPdf', () => {
  it('makes one page for short text and more pages for long text', async () => {
    expect(await pages((await textToPdf('Hello\nworld', opts)).bytes)).toBe(1);
    const long = Array.from({ length: 300 }, (_, i) => `Line number ${i}`).join('\n');
    expect(await pages((await textToPdf(long, opts)).bytes)).toBeGreaterThan(4);
  });

  it('handles Hindi and mixed text', async () => {
    const { bytes, replaced } = await textToPdf('हिन्दी भाषा में नमस्ते, hello world 123', opts);
    expect(replaced).toBe(0);
    expect(bytes.length).toBeGreaterThan(2000);
  });

  it('counts letters that cannot be shown', async () => {
    expect((await textToPdf('a 😀 b', opts)).replaced).toBe(1);
  });

  it('refuses empty text', async () => {
    await expect(textToPdf('  \n ', opts)).rejects.toMatchObject({ errorKey: 'error.textEmpty' });
  });
});

describe('csvToPdf', () => {
  it('makes a table over many pages and repeats nothing broken', async () => {
    const rows = ['name,city,note'];
    for (let i = 0; i < 200; i += 1) rows.push(`Person ${i},Delhi,"A longer note for row ${i}, with a comma"`);
    const { bytes } = await csvToPdf(rows.join('\n'), opts);
    expect(await pages(bytes)).toBeGreaterThan(2);
  });

  it('handles Hindi cells and uses landscape for wide tables', async () => {
    const { bytes } = await csvToPdf('नाम,शहर,a,b,c,d,e\nराम,दिल्ली,1,2,3,4,5', opts);
    const doc = await PDFDocument.load(bytes);
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeGreaterThan(height);
  });

  it('refuses too many columns and empty files', async () => {
    const wide = Array.from({ length: 45 }, (_, i) => `c${i}`).join(',');
    await expect(csvToPdf(wide, opts)).rejects.toMatchObject({ errorKey: 'error.csvTooWide' });
    await expect(csvToPdf('\n\n', opts)).rejects.toMatchObject({ errorKey: 'error.textEmpty' });
  });
});

describe('htmlToPdf', () => {
  const blocks = [
    { kind: 'heading', level: 1, runs: [{ text: 'Title नमस्ते', bold: true }] },
    { kind: 'para', runs: [{ text: 'Some ' }, { text: 'bold', bold: true }, { text: ' text\nnext line' }] },
    { kind: 'item', marker: '•', depth: 0, runs: [{ text: 'one' }] },
    { kind: 'item', marker: '1.', depth: 1, runs: [{ text: 'two' }] },
    { kind: 'pre', text: 'code  here\n\nmore' },
    { kind: 'rule' },
    { kind: 'table', rows: [['a', 'b'], ['1', '2']] },
  ];

  it('draws all kinds of blocks', async () => {
    expect(await pages((await htmlToPdf(blocks, opts)).bytes)).toBe(1);
  });

  it('refuses a page with no text', async () => {
    await expect(htmlToPdf([{ kind: 'rule' }], opts)).rejects.toMatchObject({ errorKey: 'error.htmlEmpty' });
  });
});
