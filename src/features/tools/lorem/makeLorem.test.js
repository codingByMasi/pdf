// Tests for the sample text maker.
import { describe, expect, it } from 'vitest';
import { makeLorem } from './makeLorem.js';

describe('makeLorem', () => {
  it('makes the asked number of words, starting the usual way', () => {
    const text = makeLorem('words', 12);
    expect(text.split(' ')).toHaveLength(12);
    expect(text.startsWith('lorem ipsum dolor sit amet')).toBe(true);
  });
  it('makes paragraphs', () => expect(makeLorem('paragraphs', 3).split('\n\n')).toHaveLength(3));
  it('makes sentences ending with a full stop', () => expect(makeLorem('sentences', 2).endsWith('.')).toBe(true));
  it('keeps the count in range', () => expect(makeLorem('words', 99999).split(' ')).toHaveLength(2000));
});
