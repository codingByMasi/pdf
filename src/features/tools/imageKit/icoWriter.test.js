// Tests for the .ico writer.
import { describe, expect, it } from 'vitest';
import { writeIco } from './icoWriter.js';

describe('writeIco', () => {
  it('writes a header, one entry per picture and the picture bytes', () => {
    const out = writeIco([{ size: 16, bytes: new Uint8Array([1, 2, 3]) }, { size: 256, bytes: new Uint8Array([9, 9]) }]);
    const view = new DataView(out.buffer);
    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);
    expect(out[6]).toBe(16);
    expect(out[22]).toBe(0);
    expect(view.getUint32(6 + 12, true)).toBe(38);
    expect(Array.from(out.slice(38, 41))).toEqual([1, 2, 3]);
    expect(out.length).toBe(38 + 3 + 2);
  });
});
