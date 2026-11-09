// Turns a QR grid into a picture: an SVG text, or a PNG made on a canvas. Includes the white margin ("quiet zone").
export const QUIET = 4;

export function qrToSvg(grid, { dark = '#000000', light = '#ffffff' } = {}) {
  const size = grid.length + QUIET * 2;
  let path = '';
  grid.forEach((row, r) => {
    for (let c = 0; c < row.length; c += 1) {
      if (!row[c]) continue;
      let end = c;
      while (end + 1 < row.length && row[end + 1]) end += 1;
      path += `M${c + QUIET} ${r + QUIET}h${end - c + 1}v1h-${end - c + 1}z`;
      c = end;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${light}"/><path d="${path}" fill="${dark}"/></svg>`;
}

// Draws the grid on a canvas whose side is about `pixels` (a whole number of pixels per square).
export function drawQr(canvas, grid, pixels = 600, { dark = '#000000', light = '#ffffff' } = {}) {
  const modules = grid.length + QUIET * 2;
  const cell = Math.max(1, Math.floor(pixels / modules));
  canvas.width = cell * modules;
  canvas.height = cell * modules;
  const context = canvas.getContext('2d');
  context.fillStyle = light;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = dark;
  grid.forEach((row, r) => row.forEach((on, c) => { if (on) context.fillRect((c + QUIET) * cell, (r + QUIET) * cell, cell, cell); }));
  return canvas;
}
