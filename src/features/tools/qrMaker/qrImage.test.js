// Tests for the QR picture text.
import { describe, expect, it } from 'vitest';
import { makeQr } from '../../../shared/lib/qr/qrMatrix.js';
import { qrToSvg } from './qrImage.js';

describe('qrToSvg', () => {
  it('makes an SVG with the margin included', () => {
    const grid = makeQr('hello', 'M');
    const svg = qrToSvg(grid);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain(`viewBox="0 0 ${grid.length + 8} ${grid.length + 8}"`);
    expect(svg).toContain('<path d="M');
  });
});
