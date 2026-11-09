// Turns a photo of a signature on paper into a see-through signature: paper becomes clear, ink stays (or is painted one colour).
// data: canvas pixels (changed in place). options: { tolerance 5-120, ink: 'keep' | 'black' | 'blue' }. Returns the box that holds the ink, or null.
const INKS = { black: [20, 20, 20], blue: [20, 50, 160] };

export function cleanSignature(data, width, height, { tolerance = 40, ink = 'keep' } = {}) {
  // Paper colour: the brightest typical colour of the picture edge.
  const edge = [];
  const take = (x, y) => { const i = (y * width + x) * 4; edge.push(data[i] + data[i + 1] + data[i + 2]); };
  for (let x = 0; x < width; x += 1) { take(x, 0); take(x, height - 1); }
  for (let y = 0; y < height; y += 1) { take(0, y); take(width - 1, y); }
  edge.sort((a, b) => a - b);
  const paper = (edge[Math.floor(edge.length * 0.75)] || 765) / 3;
  const range = Math.max(20, paper * 0.5);
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const dark = paper - (data[i] + data[i + 1] + data[i + 2]) / 3;
      const alpha = dark <= tolerance ? 0 : Math.min(255, Math.round(((dark - tolerance) / range) * 255));
      data[i + 3] = alpha;
      if (alpha > 0 && INKS[ink]) { [data[i], data[i + 1], data[i + 2]] = INKS[ink]; }
      if (alpha > 40) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}
