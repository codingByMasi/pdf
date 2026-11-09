// Tests for reading real Word, Excel and PowerPoint files (made with other software) into text blocks.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readOffice } from './readOffice.js';

const load = (name) => new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));
const text = (block) => (block.runs ?? []).map((r) => r.text).join('');

describe('readOffice docx', () => {
  it('reads headings, bold text, lists, tables and Hindi', async () => {
    const { blocks } = await readOffice(load('sample.docx'), 'docx');
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 1 });
    expect(text(blocks[0])).toBe('Annual Report');
    expect(blocks.find((b) => b.kind === 'heading' && text(b) === 'Summary').level).toBe(1);
    const para = blocks.find((b) => text(b).startsWith('This is'));
    expect(text(para)).toBe('This is important text & more <tags>.');
    expect(para.runs.find((r) => r.text === 'important').bold).toBe(true);
    const items = blocks.filter((b) => b.kind === 'item');
    expect(items.map((i) => i.marker)).toEqual(['•', '•', '1.', '2.']);
    expect(blocks.find((b) => b.kind === 'table').rows).toEqual([['Name', 'Marks'], ['Asha', '91']]);
    expect(blocks.some((b) => text(b) === 'नमस्ते दुनिया')).toBe(true);
  });
});

describe('readOffice xlsx', () => {
  it('reads sheets, numbers and dates', async () => {
    const { blocks } = await readOffice(load('sample.xlsx'), 'xlsx');
    expect(text(blocks[0])).toBe('Sales');
    expect(blocks[1].rows).toEqual([['Item', 'Price', 'Date'], ['Pen', '12.5', '2024-03-05'], ['Book', '0.3', '2024-03-06']]);
    expect(text(blocks[2])).toBe('Notes');
    expect(blocks[3].rows).toEqual([['Hello', ''], ['', 'World']]);
  });
});

describe('readOffice pptx', () => {
  it('reads slide titles and bullets in order', async () => {
    const { blocks } = await readOffice(load('sample.pptx'), 'pptx');
    const words = blocks.map(text);
    expect(words).toEqual(['Slide 1', 'Welcome', 'First bullet', 'Second bullet', '', 'Slide 2', 'Second slide', 'Only bullet', '']);
  });
});

describe('readOffice errors', () => {
  it('rejects files that are not zip packages', async () => {
    await expect(readOffice(new Uint8Array([1, 2, 3, 4, 5]), 'docx')).rejects.toMatchObject({ errorKey: 'error.officeBad' });
  });
  it('rejects a zip with the wrong content', async () => {
    await expect(readOffice(load('sample.xlsx'), 'docx')).rejects.toMatchObject({ errorKey: 'error.officeBad' });
  });
});
