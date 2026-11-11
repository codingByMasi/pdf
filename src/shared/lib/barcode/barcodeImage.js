// Draws a barcode (list of bar and space widths, bar first) as SVG text or on a canvas, with a quiet zone and the text below.
const QUIET = 10;

export function barcodeToSvg(runs, label, { height = 80, dark = '#000000' } = {}) {
  const total = runs.reduce((a, b) => a + b, 0) + QUIET * 2;
  let x = QUIET;
  let bars = '';
  runs.forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x}" y="4" width="${w}" height="${height}"/>`; x += w; });
  const text = label ? `<text x="${total / 2}" y="${height + 20}" text-anchor="middle" font-family="monospace" font-size="12">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${height + 28}" shape-rendering="crispEdges"><rect width="${total}" height="${height + 28}" fill="#fff"/><g fill="${dark}">${bars}</g>${text}</svg>`;
}

export function drawBarcode(canvas, runs, label, scale = 3, { height = 80, dark = '#000000' } = {}) {
  const total = runs.reduce((a, b) => a + b, 0) + QUIET * 2;
  canvas.width = total * scale;
  canvas.height = (height + 28) * scale;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = dark;
  let x = QUIET;
  runs.forEach((w, i) => { if (i % 2 === 0) context.fillRect(x * scale, 4 * scale, w * scale, height * scale); x += w; });
  if (label) {
    context.font = `${12 * scale}px monospace`;
    context.textAlign = 'center';
    context.fillText(label, canvas.width / 2, (height + 20) * scale);
  }
  return canvas;
}
