// The things a person can put on a page (pen lines, boxes, text, pictures) and how to move or resize them.
// All spots are in "page-width units": x from 0 to 1 across the page, y counted down in the same units.
let nextId = 1;
const id = () => nextId++;

export const COLORS = {
  black: '#111111',
  red: '#d32f2f',
  blue: '#1a56db',
  green: '#2e7d32',
  yellow: '#ffeb3b',
};

export const makePath = (points, color, width) => ({ id: id(), type: 'path', points, color, width });
export const makeBox = (type, x, y, w, h, style) => ({ id: id(), type, x, y, w, h, ...style });
export const makeLine = (x1, y1, x2, y2, color, width) => ({ id: id(), type: 'line', x1, y1, x2, y2, color, width });
export const makeText = (x, y, text, size, color) => ({ id: id(), type: 'text', x, y, text, size, color });
export const makeImage = (x, y, w, h, bytes, mime, url) => ({ id: id(), type: 'image', x, y, w, h, bytes, mime, url });

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function moveItem(item, dx, dy) {
  if (item.type === 'path') return { ...item, points: item.points.map(([x, y]) => [x + dx, y + dy]) };
  if (item.type === 'line') return { ...item, x1: item.x1 + dx, y1: item.y1 + dy, x2: item.x2 + dx, y2: item.y2 + dy };
  return { ...item, x: item.x + dx, y: item.y + dy };
}

// Rough size of text, used for dragging and for keeping it on the page.
export function textBounds(item) {
  const lines = item.text.split('\n');
  const longest = Math.max(...lines.map((line) => line.length), 1);
  return { x: item.x, y: item.y, w: longest * item.size * 0.55, h: lines.length * item.size * 1.3 };
}

export function boundsOf(item) {
  if (item.type === 'text') return textBounds(item);
  if (item.type === 'path') {
    const xs = item.points.map((p) => p[0]);
    const ys = item.points.map((p) => p[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }
  if (item.type === 'line') {
    return { x: Math.min(item.x1, item.x2), y: Math.min(item.y1, item.y2), w: Math.abs(item.x2 - item.x1), h: Math.abs(item.y2 - item.y1) };
  }
  return { x: item.x, y: item.y, w: item.w, h: item.h };
}

// Moves an item but keeps it mostly on the page (limit = page height in width units).
export function moveWithin(item, dx, dy, limit) {
  const b = boundsOf(item);
  const sx = clamp(dx, -b.x, 1 - b.w - b.x);
  const sy = clamp(dy, -b.y, limit - b.h - b.y);
  return moveItem(item, b.w > 1 ? dx : sx, b.h > limit ? dy : sy);
}

// Sets a box or picture to a new width, keeping the shape of pictures.
export function resizeItem(item, w, aspect) {
  if (item.type === 'image') return { ...item, w, h: w * aspect };
  if (item.type === 'text') return { ...item, size: w };
  return { ...item, w };
}
