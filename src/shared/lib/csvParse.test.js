// Tests for the CSV reader.
import { describe, expect, it } from 'vitest';
import { parseCsv } from './csvParse.js';

describe('parseCsv', () => {
  it('reads commas, quotes and blank lines', () => {
    const { rows } = parseCsv('a,b\n"x, y","say ""hi"""\n\n1,2\n');
    expect(rows).toEqual([['a', 'b'], ['x, y', 'say "hi"'], ['1', '2']]);
  });

  it('finds semicolons and tabs', () => {
    expect(parseCsv('a;b;c\n1;2;3').rows[1]).toEqual(['1', '2', '3']);
    expect(parseCsv('a\tb\n1\t2').rows[1]).toEqual(['1', '2']);
  });

  it('keeps line breaks inside quotes and handles Windows line ends', () => {
    expect(parseCsv('a,b\r\n"one\ntwo",3\r\n').rows[1]).toEqual(['one\ntwo', '3']);
  });
});
