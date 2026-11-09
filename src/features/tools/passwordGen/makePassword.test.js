// Tests for the password maker.
import { describe, expect, it } from 'vitest';
import { makePassword, secureInt, strengthBits } from './makePassword.js';

describe('makePassword', () => {
  it('has the right length and one of each chosen kind', () => {
    for (let i = 0; i < 30; i += 1) {
      const p = makePassword({ length: 12, symbols: true });
      expect(p).toHaveLength(12);
      expect(p).toMatch(/[a-z]/); expect(p).toMatch(/[A-Z]/); expect(p).toMatch(/\d/); expect(p).toMatch(/[^A-Za-z0-9]/);
    }
  });
  it('leaves out look-alikes in easy mode', () => {
    for (let i = 0; i < 30; i += 1) expect(makePassword({ length: 60 })).not.toMatch(/[0O1lI]/);
  });
  it('gives nothing when no kind is chosen', () => {
    expect(makePassword({ lower: false, upper: false, digits: false, symbols: false })).toBe('');
  });
  it('picks numbers below the limit', () => {
    for (let i = 0; i < 200; i += 1) expect(secureInt(7)).toBeLessThan(7);
  });
  it('rates longer passwords higher', () => {
    expect(strengthBits('aB3$aB3$aB3$')).toBeGreaterThan(strengthBits('aB3$'));
  });
});
