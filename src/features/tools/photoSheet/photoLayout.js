// Works out where small photos go on a sheet of paper, as many as fit (or a chosen number).
export const MM = 72 / 25.4;
export const PHOTO_SIZES = { '35x45': [35, 45], '51x51': [51, 51], '25x35': [25, 35], '30x40': [30, 40] };
export const SHEETS = { '4x6': [288, 432], a4: [595.28, 841.89], letter: [612, 792] };

function grid(sheet, photo, gap, margin) {
  const columns = Math.max(0, Math.floor((sheet[0] - 2 * margin + gap) / (photo[0] + gap)));
  const rows = Math.max(0, Math.floor((sheet[1] - 2 * margin + gap) / (photo[1] + gap)));
  return { columns, rows };
}

// sheet, photo: [width, height] in points. Returns { sheet, positions: [{ x, y }] } (y from the bottom), or null if one photo does not fit.
export function layoutPhotos(sheet, photo, { gap = 6, margin = 12, copies = null } = {}) {
  const upright = grid(sheet, photo, gap, margin);
  const sideways = grid([sheet[1], sheet[0]], photo, gap, margin);
  const turn = sideways.columns * sideways.rows > upright.columns * upright.rows;
  const size = turn ? [sheet[1], sheet[0]] : sheet;
  const { columns, rows } = turn ? sideways : upright;
  const total = columns * rows;
  if (total === 0) return null;
  const count = copies ? Math.min(copies, total) : total;
  const usedColumns = Math.min(columns, count);
  const usedRows = Math.ceil(count / columns);
  const blockW = usedColumns * photo[0] + (usedColumns - 1) * gap;
  const blockH = usedRows * photo[1] + (usedRows - 1) * gap;
  const left = (size[0] - blockW) / 2;
  const top = (size[1] - blockH) / 2 + blockH;
  const positions = Array.from({ length: count }, (_, n) => ({
    x: left + (n % columns) * (photo[0] + gap),
    y: top - (Math.floor(n / columns) + 1) * photo[1] - Math.floor(n / columns) * gap,
  }));
  return { sheet: size, positions };
}
