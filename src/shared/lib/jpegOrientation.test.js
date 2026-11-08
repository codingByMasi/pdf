// Tests for sniffImageType and jpegOrientation, including a photo marked "turned right".
import { describe, it, expect } from 'vitest';
import { jpegOrientation } from './jpegOrientation.js';
import { sniffImageType } from './sniffImage.js';
import { tinyJpg, tinyPng } from './testImages.js';

// Builds a JPG with an EXIF block that holds the given orientation.
function withOrientation(value, little = false) {
  const tiff = new Uint8Array(26);
  const view = new DataView(tiff.buffer);
  view.setUint16(0, little ? 0x4949 : 0x4d4d);
  view.setUint16(2, 42, little);
  view.setUint32(4, 8, little);
  view.setUint16(8, 1, little);
  view.setUint16(10, 0x0112, little);
  view.setUint16(12, 3, little);
  view.setUint32(14, 1, little);
  view.setUint16(18, value, little);
  const exif = new Uint8Array(2 + 2 + 6 + tiff.length);
  const ev = new DataView(exif.buffer);
  exif[0] = 0xff;
  exif[1] = 0xe1;
  ev.setUint16(2, 2 + 6 + tiff.length);
  exif.set([0x45, 0x78, 0x69, 0x66, 0, 0], 4);
  exif.set(tiff, 10);
  return Uint8Array.from([0xff, 0xd8, ...exif, ...tinyJpg.slice(2)]);
}

describe('sniffImageType', () => {
  it('finds jpg and png by content', () => {
    expect(sniffImageType(tinyJpg)).toBe('jpg');
    expect(sniffImageType(tinyPng)).toBe('png');
    expect(sniffImageType(new TextEncoder().encode('hello'))).toBe(null);
  });
});

describe('jpegOrientation', () => {
  it('is 1 when there is no EXIF', () => {
    expect(jpegOrientation(tinyJpg)).toBe(1);
    expect(jpegOrientation(tinyPng)).toBe(1);
    expect(jpegOrientation(new Uint8Array(0))).toBe(1);
  });
  it('reads the number in both byte orders', () => {
    expect(jpegOrientation(withOrientation(6))).toBe(6);
    expect(jpegOrientation(withOrientation(8, true))).toBe(8);
  });
  it('ignores impossible numbers', () => {
    expect(jpegOrientation(withOrientation(9))).toBe(1);
  });
});
