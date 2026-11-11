// Tests the fingerprints against known answers.
import { describe, it, expect } from 'vitest';
import { cleanHash, hashBytes, sameHash } from './hashes.js';

const bytes = new TextEncoder().encode('abc');

describe('hashes', () => {
  it('gives the known SHA-256 and SHA-1 of "abc"', async () => {
    expect(await hashBytes(bytes, 'SHA-256')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await hashBytes(bytes, 'SHA-1')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });
  it('compares fingerprints loosely', () => {
    expect(sameHash('AB:CD ef', 'abcdef')).toBe(true);
    expect(sameHash('', '')).toBe(false);
    expect(cleanHash(' A B ')).toBe('ab');
  });
});
