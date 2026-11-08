// Tests for the zip maker: checksum, structure, and names.
import { describe, it, expect } from 'vitest';
import { crc32, makeZip } from './zipFiles.js';

const bytes = (text) => new TextEncoder().encode(text);

describe('crc32', () => {
  it('matches the known value for "123456789"', () => {
    expect(crc32(bytes('123456789'))).toBe(0xcbf43926);
  });
});

describe('makeZip', () => {
  const zip = makeZip([
    { name: 'a.txt', data: bytes('hello') },
    { name: 'रिपोर्ट.txt', data: bytes('world!') },
  ]);
  const view = new DataView(zip.buffer);

  it('starts with a file header and ends with an end record', () => {
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50);
  });
  it('counts both files', () => {
    expect(view.getUint16(zip.length - 22 + 10, true)).toBe(2);
  });
  it('stores the file contents as they are', () => {
    expect(new TextDecoder().decode(zip.slice(35, 40))).toBe('hello');
  });
  it('makes an empty zip when no files are given', () => {
    expect(makeZip([]).length).toBe(22);
  });
});
