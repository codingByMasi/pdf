// Tests the GIF maker: reads the file back with a small LZW decoder.
import { describe, expect, it } from 'vitest';
import { encodeGif } from './encodeGif.js';
import { lzwEncode } from './lzw.js';

function lzwDecode(bytes, minCode) {
  const clear = 1 << minCode;
  const end = clear + 1;
  let table = [];
  const reset = () => { table = []; for (let i = 0; i < clear + 2; i += 1) table.push([i]); };
  reset();
  let size = minCode + 1;
  let bits = 0;
  let nbits = 0;
  let pos = 0;
  let prev = null;
  const out = [];
  while (true) {
    while (nbits < size && pos < bytes.length) { bits |= bytes[pos] << nbits; pos += 1; nbits += 8; }
    if (nbits < size) break;
    const code = bits & ((1 << size) - 1);
    bits >>>= size;
    nbits -= size;
    if (code === clear) { reset(); size = minCode + 1; prev = null; continue; }
    if (code === end) break;
    let entry;
    if (code < table.length) entry = table[code];
    else entry = [...prev, prev[0]];
    out.push(...entry);
    if (prev) table.push([...prev, entry[0]]);
    prev = entry;
    if (table.length === (1 << size) && size < 12) size += 1;
  }
  return out;
}

describe('lzwEncode', () => {
  it('round trips random-ish data, even past the table limit', () => {
    const data = Uint8Array.from({ length: 20000 }, (_, i) => ((i * 7) ^ (i >> 3)) % 16);
    expect(lzwDecode(lzwEncode(data, 4), 4)).toEqual([...data]);
  });
  it('round trips a single value', () => {
    expect(lzwDecode(lzwEncode(Uint8Array.from([1]), 2), 2)).toEqual([1]);
  });
});

describe('encodeGif', () => {
  it('writes a valid header, size and trailer', () => {
    const red = new Uint8ClampedArray(4 * 4 * 4);
    const blue = new Uint8ClampedArray(4 * 4 * 4);
    for (let i = 0; i < red.length; i += 4) { red.set([255, 0, 0, 255], i); blue.set([0, 0, 255, 255], i); }
    const gif = encodeGif([red, blue], 4, 4, 300);
    expect(String.fromCharCode(...gif.slice(0, 6))).toBe('GIF89a');
    expect(gif[6] + gif[7] * 256).toBe(4);
    expect(gif[gif.length - 1]).toBe(0x3b);
  });
});
