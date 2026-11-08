// Tests for the zip reader: pictures only, name order, packed and stored files, and bomb guards.
import { deflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { crc32 } from '../../../shared/lib/zipFiles.js';
import { tinyJpg } from '../../../shared/lib/testImages.js';
import { readZipImages } from './zipReader.js';

// Builds a zip. entries: [{ name, data, method: 0 | 8, sizeLie? }]
function buildZip(entries) {
  const parts = [];
  const central = [];
  let offset = 0;
  const enc = new TextEncoder();
  for (const e of entries) {
    const name = enc.encode(e.name);
    const packed = e.method === 8 ? deflateRawSync(e.data) : e.data;
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(8, e.method ?? 0, true);
    lv.setUint32(14, crc32(e.data), true);
    lv.setUint32(18, packed.length, true);
    lv.setUint32(22, e.data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);
    const head = new Uint8Array(46 + name.length);
    const hv = new DataView(head.buffer);
    hv.setUint32(0, 0x02014b50, true);
    hv.setUint16(10, e.method ?? 0, true);
    hv.setUint32(16, crc32(e.data), true);
    hv.setUint32(20, packed.length, true);
    hv.setUint32(24, e.sizeLie ?? e.data.length, true);
    hv.setUint16(28, name.length, true);
    hv.setUint32(42, offset, true);
    head.set(name, 46);
    parts.push(local, packed);
    central.push(head);
    offset += local.length + packed.length;
  }
  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  const all = [...parts, ...central, end];
  const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of all) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

const jpg = tinyJpg;

describe('readZipImages', () => {
  it('returns pictures in natural name order and counts other files', async () => {
    const zip = buildZip([
      { name: 'img10.jpg', data: jpg, method: 8 },
      { name: 'img2.JPG', data: jpg, method: 0 },
      { name: 'notes.txt', data: new TextEncoder().encode('hi'), method: 0 },
      { name: '__MACOSX/img1.jpg', data: jpg, method: 0 },
      { name: 'folder/', data: new Uint8Array(0), method: 0 },
    ]);
    const { images, skipped } = await readZipImages(zip);
    expect(images.map((i) => i.name)).toEqual(['img2.JPG', 'img10.jpg']);
    expect(images[0].bytes).toEqual(jpg);
    expect(images[1].bytes).toEqual(jpg);
    expect(skipped).toBe(2);
  });

  it('says so when there are no pictures or the file is not a zip', async () => {
    await expect(readZipImages(buildZip([{ name: 'a.txt', data: new Uint8Array([1]), method: 0 }]))).rejects.toMatchObject({ errorKey: 'error.zipEmpty' });
    await expect(readZipImages(new Uint8Array(100))).rejects.toMatchObject({ errorKey: 'error.zipBad' });
  });

  it('stops a zip that unpacks bigger than it says', async () => {
    const big = new Uint8Array(200000);
    const zip = buildZip([{ name: 'a.jpg', data: big, method: 8, sizeLie: 100 }]);
    await expect(readZipImages(zip)).rejects.toMatchObject({ errorKey: 'error.zipBad' });
  });
});
