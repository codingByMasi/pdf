// Tests for text cleaning and line wrapping with English and Hindi.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { createFontBook } from './fontBook.js';
import { loadTestFont } from './testFonts.js';
import { splitByScript } from './textScript.js';
import { wrapText } from './textWrap.js';

async function makeBook() {
  const doc = await PDFDocument.create();
  return createFontBook(doc, { deva: true, bold: true, loadBytes: loadTestFont });
}

describe('splitByScript', () => {
  it('keeps English and Hindi apart', () => {
    expect(splitByScript('Hello नमस्ते, world').map((r) => r.script)).toEqual(['latin', 'deva', 'latin']);
  });
});

describe('font book', () => {
  it('replaces letters the fonts lack and counts them', async () => {
    const book = await makeBook();
    expect(book.clean('A😀B\u0007')).toBe('A?B');
    expect(book.replaced).toBe(1);
  });

  it('keeps Hindi letters', async () => {
    const book = await makeBook();
    expect(book.clean('हिन्दी, ok')).toBe('हिन्दी, ok');
    expect(book.replaced).toBe(0);
  });
});

describe('wrapText', () => {
  it('wraps long English text inside the width', async () => {
    const book = await makeBook();
    const lines = wrapText(book, 'word '.repeat(60), 'regular', 12, 200);
    expect(lines.length).toBeGreaterThan(3);
    for (const line of lines) expect(line.width).toBeLessThanOrEqual(200.01);
  });

  it('breaks a word that is wider than the line', async () => {
    const book = await makeBook();
    const lines = wrapText(book, 'x'.repeat(200), 'regular', 12, 100);
    expect(lines.length).toBeGreaterThan(2);
    expect(lines.map((l) => l.segments.map((s) => s.text).join('')).join('')).toBe('x'.repeat(200));
  });

  it('wraps Hindi without cutting a letter from its marks', async () => {
    const book = await makeBook();
    const lines = wrapText(book, 'नमस्ते '.repeat(30), 'regular', 12, 120);
    expect(lines.length).toBeGreaterThan(2);
    for (const line of lines) expect(line.segments.map((s) => s.text).join('')).not.toMatch(/^[ा-्]/);
  });

  it('keeps empty lines', async () => {
    const book = await makeBook();
    expect(wrapText(book, 'a\n\nb', 'regular', 12, 200)).toHaveLength(3);
  });
});
