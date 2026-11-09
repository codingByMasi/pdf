// Finds the main colours of a picture and turns colours into text like #aabbcc, rgb(...) and hsl(...).
export const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

export function toHsl([r, g, b]) {
  const [x, y, z] = [r, g, b].map((v) => v / 255);
  const max = Math.max(x, y, z);
  const min = Math.min(x, y, z);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === x) h = ((y - z) / d + 6) % 6;
    else if (max === y) h = (z - x) / d + 2;
    else h = (x - y) / d + 4;
  }
  return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
}

// data: canvas pixel data. Returns up to `count` colours [[r, g, b], ...], most common first, skipping near-duplicates.
export function dominantColours(data, count = 6) {
  const buckets = new Map();
  const step = Math.max(1, Math.floor(data.length / 4 / 40000));
  for (let i = 0; i < data.length; i += 4 * step) {
    if (data[i + 3] < 128) continue;
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n += 1;
    b.r += data[i];
    b.g += data[i + 1];
    b.b += data[i + 2];
    buckets.set(key, b);
  }
  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n).map((b) => [Math.round(b.r / b.n), Math.round(b.g / b.n), Math.round(b.b / b.n)]);
  const picked = [];
  for (const colour of sorted) {
    if (picked.every((p) => Math.hypot(p[0] - colour[0], p[1] - colour[1], p[2] - colour[2]) > 48)) picked.push(colour);
    if (picked.length === count) break;
  }
  return picked;
}
