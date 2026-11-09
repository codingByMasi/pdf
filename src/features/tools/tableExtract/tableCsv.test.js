// Tests turning positioned text into CSV rows.
import { describe, it, expect } from 'vitest';
import { pagesToCsv } from './tableCsv.js';

const piece = (str, x, y) => ({ str, transform: [1, 0, 0, 1, x, y], width: str.length * 6, height: 10 });

describe('pagesToCsv', () => {
  it('makes rows and columns from positions, quoting commas', () => {
    const page = [piece('Item', 10, 100), piece('Price', 150, 100), piece('Pen, blue', 10, 80), piece('12', 150, 80), piece('Just a heading', 10, 140)];
    const csv = pagesToCsv([page]);
    expect(csv).toBe('﻿Item,Price\r\n"Pen, blue",12');
  });
  it('keeps single-cell lines when asked', () => {
    expect(pagesToCsv([[piece('Hello', 10, 10)]], { onlyTables: false })).toBe('﻿Hello');
  });
  it('separates pages with an empty line', () => {
    const p = [piece('a', 10, 10), piece('b', 100, 10)];
    expect(pagesToCsv([p, p])).toBe('﻿a,b\r\n\r\na,b');
  });
});
