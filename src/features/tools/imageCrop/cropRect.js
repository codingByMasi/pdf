// Turns a box (shares of the picture, 0 to 1) into whole pixels, and back from margins in percent.
export function rectToPixels(rect, width, height) {
  const x = Math.max(0, Math.round(rect.x * width));
  const y = Math.max(0, Math.round(rect.y * height));
  return { x, y, w: Math.max(1, Math.min(width - x, Math.round(rect.w * width))), h: Math.max(1, Math.min(height - y, Math.round(rect.h * height))) };
}

// margins: { left, top, right, bottom } in percent (0 to 99). Returns a box, or null if nothing would be left.
export function marginsToRect({ left = 0, top = 0, right = 0, bottom = 0 }) {
  const w = 1 - (left + right) / 100;
  const h = 1 - (top + bottom) / 100;
  return w > 0.01 && h > 0.01 ? { x: left / 100, y: top / 100, w, h } : null;
}

export function rectToMargins(rect) {
  const round = (v) => Math.round(v * 1000) / 10;
  return { left: round(rect.x), top: round(rect.y), right: round(1 - rect.x - rect.w), bottom: round(1 - rect.y - rect.h) };
}
