// Checks that English and Hindi have exactly the same keys and blanks.
import { describe, it, expect } from 'vitest';
import { en } from './en.js';
import { hi } from './hi.js';

const blanks = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join(',');

describe('i18n files', () => {
  it('have the same keys', () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
  });
  it('have no empty texts', () => {
    for (const [lang, dict] of Object.entries({ en, hi })) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${lang}: ${key}`).not.toBe('');
      }
    }
  });
  it('use the same {blanks} in both languages', () => {
    for (const key of Object.keys(en)) {
      expect(blanks(hi[key]), key).toBe(blanks(en[key]));
    }
  });
});
