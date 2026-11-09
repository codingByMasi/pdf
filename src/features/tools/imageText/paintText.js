// Paints a line of text (or a tiled watermark) onto a canvas. Position is one of nine spots or "tile".
export const SPOTS = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br', 'tile'];

// Pure helper: where the text box goes for a spot. Returns { x, y, align, baseline }.
export function spotPlace(spot, width, height, pad) {
  const col = spot[1] ?? 'c';
  const row = spot[0];
  const x = col === 'l' ? pad : col === 'r' ? width - pad : width / 2;
  const y = row === 't' ? pad : row === 'b' ? height - pad : height / 2;
  return { x, y, align: col === 'l' ? 'left' : col === 'r' ? 'right' : 'center', baseline: row === 't' ? 'top' : row === 'b' ? 'bottom' : 'middle' };
}

// options: { text, sizePercent (of the shorter side), colour, opacity (0-1), spot, bold }
export function paintText(canvas, { text, sizePercent = 6, colour = '#ffffff', opacity = 0.7, spot = 'br', bold = true }) {
  const lines = String(text).split('\n').filter((line) => line.trim());
  if (lines.length === 0) return canvas;
  const context = canvas.getContext('2d');
  const size = Math.max(8, Math.round((Math.min(canvas.width, canvas.height) * sizePercent) / 100));
  context.font = `${bold ? '700 ' : ''}${size}px system-ui, "Noto Sans Devanagari", "Segoe UI", sans-serif`;
  context.fillStyle = colour;
  context.globalAlpha = Math.max(0.05, Math.min(1, opacity));
  const lineHeight = size * 1.25;
  if (spot === 'tile') {
    const widest = Math.max(...lines.map((line) => context.measureText(line).width));
    const stepX = widest + size * 2;
    const stepY = lineHeight * lines.length + size * 2;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-Math.PI / 8);
    const reach = Math.hypot(canvas.width, canvas.height) / 2;
    for (let y = -reach; y < reach; y += stepY) {
      for (let x = -reach; x < reach; x += stepX) lines.forEach((line, i) => context.fillText(line, x, y + i * lineHeight));
    }
    context.restore();
  } else {
    const place = spotPlace(spot, canvas.width, canvas.height, size * 0.6);
    context.textAlign = place.align;
    context.textBaseline = 'top';
    const total = lineHeight * lines.length;
    const top = place.baseline === 'top' ? place.y : place.baseline === 'bottom' ? place.y - total : place.y - total / 2;
    lines.forEach((line, i) => context.fillText(line, place.x, top + i * lineHeight));
  }
  context.globalAlpha = 1;
  return canvas;
}
