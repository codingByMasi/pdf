// Tests for translate.
import { describe, it, expect } from 'vitest';
import { translate } from './translate.js';

describe('translate', () => {
  it('fills blanks', () => {
    expect(translate({ a: 'Hi {name}' }, {}, 'a', { name: 'Sam' })).toBe('Hi Sam');
  });
  it('falls back to English, then to the key', () => {
    expect(translate({}, { a: 'English' }, 'a')).toBe('English');
    expect(translate({}, {}, 'zzz')).toBe('zzz');
  });
});
