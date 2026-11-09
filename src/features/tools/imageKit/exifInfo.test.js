// Tests for finding hidden camera and place data in a JPG.
import { describe, expect, it } from 'vitest';
import { readExif } from './exifInfo.js';

// Builds a tiny JPG header with an EXIF block: Make "Acme", and a GPS pointer.
function jpgWithExif(gps) {
  const ascii = (s) => [...s].map((c) => c.charCodeAt(0)).concat(0);
  const make = ascii('Acme');
  const entries = 1 + (gps ? 1 : 0);
  const ifdSize = 2 + entries * 12 + 4;
  const tiff = [0x49, 0x49, 0x2a, 0, 8, 0, 0, 0, entries & 255, 0];
  const dataAt = 8 + ifdSize;
  tiff.push(0x0f, 0x01, 2, 0, make.length, 0, 0, 0, dataAt & 255, 0, 0, 0);
  if (gps) tiff.push(0x25, 0x88, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0);
  tiff.push(0, 0, 0, 0, ...make);
  const body = [...ascii('Exif'), 0, ...tiff];
  const length = body.length + 2;
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, length >> 8, length & 255, ...body.slice(0, 5), ...body.slice(5), 0xff, 0xd9]);
}

describe('readExif', () => {
  it('finds nothing in a plain JPG or in other data', () => {
    expect(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9, 0, 0, 0, 0, 0, 0, 0, 0])).hasExif).toBe(false);
    expect(readExif(new Uint8Array([1, 2, 3])).hasExif).toBe(false);
  });
  it('reads the camera name and sees GPS', () => {
    const info = readExif(jpgWithExif(true));
    expect(info.hasExif).toBe(true);
    expect(info.hasGps).toBe(true);
    expect(info.camera).toBe('Acme');
  });
  it('says no GPS when there is none', () => {
    expect(readExif(jpgWithExif(false)).hasGps).toBe(false);
  });
});
