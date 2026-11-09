// Tests for English-letter Hindi typing.
import { describe, expect, it } from 'vitest';
import { EXAMPLES, transliterate } from './transliterate.js';

describe('transliterate', () => {
  it.each([
    ['kamal', 'कमल'], ['hindii', 'हिन्दी'], ['hiMdii', 'हिंदी'], ['kitaab', 'किताब'], ['skuul', 'स्कूल'], ['prem', 'प्रेम'], ['shaanti', 'शान्ति'],
    ['khaanaa', 'खाना'], ['ghar', 'घर'], ['chaay', 'चाय'], ['gyaan', 'ज्ञान'], ['kshamaa', 'क्षमा'], ['TheeK', 'ठीक'],
  ])('%s', (input, expected) => {
    expect(transliterate(input)).toBe(expected);
  });
  it('gets the listed examples right', () => {
    for (const [input, expected] of EXAMPLES) expect(transliterate(input)).toBe(expected);
  });
  it('keeps braces text, numbers and punctuation', () => {
    expect(transliterate('meraa {PDF} 12.')).toBe('मेरा PDF 12।');
    expect(transliterate('a 5', { digits: true })).toBe('अ ५');
  });
  it('can keep the full stop', () => expect(transliterate('hai.', { danda: false })).toBe('है.'));
});
