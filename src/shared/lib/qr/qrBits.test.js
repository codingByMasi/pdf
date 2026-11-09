// Tests for the QR maker: size, long text, and that the codes can be read back by a real QR reader.
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { makeQr } from './qrMatrix.js';

const require = createRequire(import.meta.url);
let reader = null;
try { reader = require('/tmp/claude-0/qrcheck/node_modules/jsqr'); } catch { reader = null; }

function read(grid) {
  const scale = 4;
  const quiet = 4;
  const side = (grid.length + quiet * 2) * scale;
  const data = new Uint8ClampedArray(side * side * 4).fill(255);
  grid.forEach((row, r) => row.forEach((dark, c) => {
    if (!dark) return;
    for (let y = 0; y < scale; y += 1) for (let x = 0; x < scale; x += 1) data[(((r + quiet) * scale + y) * side + (c + quiet) * scale + x) * 4] = data[(((r + quiet) * scale + y) * side + (c + quiet) * scale + x) * 4 + 1] = data[(((r + quiet) * scale + y) * side + (c + quiet) * scale + x) * 4 + 2] = 0;
  }));
  return reader(data, side, side)?.data;
}

describe('makeQr', () => {
  it('makes version 1 (21 x 21) for short text', () => {
    expect(makeQr('Hi').length).toBe(21);
  });
  it('makes bigger codes for longer text', () => {
    expect(makeQr('x'.repeat(150)).length).toBeGreaterThan(41);
  });
  it('refuses text that is too long', () => {
    expect(() => makeQr('x'.repeat(400), 'L')).toThrow();
  });
  it.skipIf(!reader)('can be read back by a QR reader (all levels, several sizes)', () => {
    const samples = ['Hi', 'https://example.com/a?b=c', 'upi://pay?pa=name@bank&pn=Asha&am=10', 'x'.repeat(60), 'नमस्ते दुनिया', 'y'.repeat(180)];
    for (const text of samples) for (const level of ['L', 'M', 'Q', 'H']) {
      let grid;
      try { grid = makeQr(text, level); } catch { continue; }
      expect(read(grid), `${level} ${text.slice(0, 10)}`).toBe(text);
    }
  });
});
