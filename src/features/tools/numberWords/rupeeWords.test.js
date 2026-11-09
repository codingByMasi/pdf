// Tests for number to words (rupees).
import { describe, expect, it } from 'vitest';
import { HI_NUMBERS } from './wordsHi.js';
import { rupeeWords } from './rupeeWords.js';
import { wordsEn } from './wordsEn.js';
import { wordsHi } from './wordsHi.js';

describe('number words', () => {
  it('writes English the Indian way', () => {
    expect(wordsEn(123456)).toBe('One Lakh Twenty-Three Thousand Four Hundred Fifty-Six');
    expect(wordsEn(10000000)).toBe('One Crore');
    expect(wordsEn(1000)).toBe('One Thousand');
    expect(wordsEn(0)).toBe('Zero');
  });
  it('writes Hindi', () => {
    expect(wordsHi(123456)).toBe('एक लाख तेईस हज़ार चार सौ छप्पन');
    expect(wordsHi(250000000)).toBe('पच्चीस करोड़');
    expect(HI_NUMBERS).toHaveLength(100);
  });
  it('writes rupees and paise', () => {
    const r = rupeeWords('1,234.50');
    expect(r.en).toBe('Rupees One Thousand Two Hundred Thirty-Four and Fifty Paise Only');
    expect(r.hi).toBe('एक हज़ार दो सौ चौंतीस रुपये और पचास पैसे मात्र');
  });
  it('handles only paise and single digit paise', () => {
    expect(rupeeWords('0.05').en).toBe('Five Paise Only');
    expect(rupeeWords('10.5').en).toBe('Rupees Ten and Fifty Paise Only');
  });
  it('handles a huge crore count', () => expect(wordsEn(123450000000)).toBe('Twelve Thousand Three Hundred Forty-Five Crore'));
  it('rejects bad input', () => {
    expect(rupeeWords('12a').errorKey).toBe('words.bad');
    expect(rupeeWords('99999999999999').errorKey).toBe('words.big');
    expect(rupeeWords('').ok).toBe(false);
  });
});
