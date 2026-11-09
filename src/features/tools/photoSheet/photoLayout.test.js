// Tests for fitting passport photos on a sheet.
import { describe, expect, it } from 'vitest';
import { MM, PHOTO_SIZES, SHEETS, layoutPhotos } from './photoLayout.js';

const size = (key) => PHOTO_SIZES[key].map((v) => v * MM);

describe('layoutPhotos', () => {
  it('fits several 35x45 mm photos on a 4x6 inch sheet', () => {
    const layout = layoutPhotos(SHEETS['4x6'], size('35x45'));
    expect(layout.positions.length).toBeGreaterThanOrEqual(6);
  });
  it('keeps every photo inside the sheet and apart from the others', () => {
    const photo = size('35x45');
    const { sheet, positions } = layoutPhotos(SHEETS.a4, photo);
    for (const p of positions) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + photo[0]).toBeLessThanOrEqual(sheet[0] + 0.01);
      expect(p.y + photo[1]).toBeLessThanOrEqual(sheet[1] + 0.01);
    }
    expect(new Set(positions.map((p) => `${p.x.toFixed(1)}|${p.y.toFixed(1)}`)).size).toBe(positions.length);
  });
  it('uses only the number of copies asked for', () => {
    expect(layoutPhotos(SHEETS.a4, size('35x45'), { copies: 4 }).positions).toHaveLength(4);
  });
  it('gives null when one photo does not fit', () => {
    expect(layoutPhotos([100, 100], size('35x45'))).toBeNull();
  });
});
