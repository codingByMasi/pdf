// Builds an animated GIF file from RGBA frames. All frames share one colour table.
import { lzwEncode } from './lzw.js';
import { medianCut, nearestFinder } from './medianCut.js';

const le16 = (n) => [n & 255, (n >> 8) & 255];

// frames: [Uint8ClampedArray RGBA of width*height]. delayMs per frame. Returns a Uint8Array.
export function encodeGif(frames, width, height, delayMs = 500) {
  const sample = [];
  const step = Math.max(1, Math.floor((frames.length * width * height) / 60000));
  let n = 0;
  for (const data of frames) {
    for (let i = 0; i < data.length; i += 4) {
      if (n % step === 0) sample.push([data[i], data[i + 1], data[i + 2]]);
      n += 1;
    }
  }
  const palette = medianCut(sample, 256);
  let bitsPerColour = 1;
  while ((1 << bitsPerColour) < palette.length) bitsPerColour += 1;
  while (palette.length < (1 << bitsPerColour)) palette.push([0, 0, 0]);
  const find = nearestFinder(palette);
  const bytes = [...'GIF89a'].map((c) => c.charCodeAt(0));
  bytes.push(...le16(width), ...le16(height), 0x80 | 0x70 | (bitsPerColour - 1), 0, 0);
  for (const c of palette) bytes.push(c[0], c[1], c[2]);
  bytes.push(0x21, 0xff, 0x0b, ...[...'NETSCAPE2.0'].map((c) => c.charCodeAt(0)), 3, 1, 0, 0, 0);
  const delay = Math.max(2, Math.round(delayMs / 10));
  const minCode = Math.max(2, bitsPerColour);
  for (const data of frames) {
    bytes.push(0x21, 0xf9, 4, 0, ...le16(delay), 0, 0);
    bytes.push(0x2c, 0, 0, 0, 0, ...le16(width), ...le16(height), 0, minCode);
    const indexes = new Uint8Array(width * height);
    for (let p = 0; p < indexes.length; p += 1) indexes[p] = find(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);
    const packed = lzwEncode(indexes, minCode);
    for (let i = 0; i < packed.length; i += 255) {
      const chunk = packed.slice(i, i + 255);
      bytes.push(chunk.length, ...chunk);
    }
    bytes.push(0);
  }
  bytes.push(0x3b);
  return Uint8Array.from(bytes);
}
