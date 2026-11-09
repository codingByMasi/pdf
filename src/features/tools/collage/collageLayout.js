// Works out where each picture goes in a collage. Pure maths, no drawing.
export const LAYOUTS = ['row', 'column', 'grid2', 'grid3'];
const CELL = 800;

// Returns { width, height, cells: [{x, y, w, h}] } for n pictures. Every cell is square-ish (CELL px) so pictures can be cropped to fill.
export function collageLayout(layout, count, gap = 0) {
  const n = Math.max(1, count);
  const cols = layout === 'row' ? n : layout === 'column' ? 1 : layout === 'grid2' ? Math.min(2, n) : Math.min(3, n);
  const rows = Math.ceil(n / cols);
  const cells = [];
  for (let i = 0; i < n; i += 1) {
    cells.push({ x: gap + (i % cols) * (CELL + gap), y: gap + Math.floor(i / cols) * (CELL + gap), w: CELL, h: CELL });
  }
  return { width: gap + cols * (CELL + gap), height: gap + rows * (CELL + gap), cells };
}

// Source box that fills a w x h cell from a picture without stretching (centre crop).
export function coverBox(imageWidth, imageHeight, w, h) {
  const scale = Math.max(w / imageWidth, h / imageHeight);
  const sw = w / scale;
  const sh = h / scale;
  return { sx: (imageWidth - sw) / 2, sy: (imageHeight - sh) / 2, sw, sh };
}
