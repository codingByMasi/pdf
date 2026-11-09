// Picks up to 256 colours for a picture set (median cut) and finds the nearest one for any pixel.
// pixels: array of [r,g,b]. Returns an array of [r,g,b] (at most `max`).
export function medianCut(pixels, max = 256) {
  let boxes = [pixels];
  while (boxes.length < max) {
    let pick = -1;
    let widest = 0;
    let channel = 0;
    boxes.forEach((box, index) => {
      if (box.length < 2) return;
      for (let c = 0; c < 3; c += 1) {
        let lo = 255;
        let hi = 0;
        for (const p of box) {
          if (p[c] < lo) lo = p[c];
          if (p[c] > hi) hi = p[c];
        }
        if (hi - lo > widest) { widest = hi - lo; pick = index; channel = c; }
      }
    });
    if (pick < 0) break;
    const box = boxes[pick].slice().sort((a, b) => a[channel] - b[channel]);
    const mid = box.length >> 1;
    boxes.splice(pick, 1, box.slice(0, mid), box.slice(mid));
  }
  return boxes.filter((box) => box.length).map((box) => {
    const sum = [0, 0, 0];
    for (const p of box) { sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2]; }
    return sum.map((v) => Math.round(v / box.length));
  });
}

// Returns a function (r,g,b) => palette index, with a small cache.
export function nearestFinder(palette) {
  const cache = new Map();
  return (r, g, b) => {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let found = cache.get(key);
    if (found === undefined) {
      let best = Infinity;
      found = 0;
      for (let i = 0; i < palette.length; i += 1) {
        const d = (palette[i][0] - r) ** 2 + (palette[i][1] - g) ** 2 + (palette[i][2] - b) ** 2;
        if (d < best) { best = d; found = i; }
      }
      cache.set(key, found);
    }
    return found;
  };
}
