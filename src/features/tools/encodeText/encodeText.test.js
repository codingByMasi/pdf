// Tests for Base64 and URL encoding.
import { describe, expect, it } from 'vitest';
import { fromBase64, fromUrl, runEncode, toBase64 } from './encodeText.js';

describe('encodeText', () => {
  it('round trips Hindi through Base64', () => {
    expect(fromBase64(toBase64('नमस्ते दुनिया')).text).toBe('नमस्ते दुनिया');
  });
  it('matches the known Base64 of hello', () => expect(toBase64('hello')).toBe('aGVsbG8='));
  it('accepts missing padding and web-safe letters', () => expect(fromBase64('aGVsbG8').text).toBe('hello'));
  it('rejects broken Base64', () => expect(fromBase64('!!!').ok).toBe(false));
  it('encodes and decodes URL text', () => {
    expect(runEncode('urlenc', 'a b&c=é').text).toBe('a%20b%26c%3D%C3%A9');
    expect(fromUrl('a%20b%26c').text).toBe('a b&c');
    expect(fromUrl('%E0%A4%A').ok).toBe(false);
  });
});
