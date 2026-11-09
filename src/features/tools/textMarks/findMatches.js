// Finds a word or phrase inside pieces of page text and gives the boxes to draw on the page (can be slanted).
// items: [{ str, transform, width, height }]. measure(text) gives the relative width of text (any consistent unit).
export function findMatches(items, query, measure, { matchCase = false } = {}) {
  const needle = matchCase ? query : query.toLowerCase();
  if (!needle.trim()) return [];
  const boxes = [];
  for (const item of items) {
    const hay = matchCase ? item.str : item.str.toLowerCase();
    const [a, b, , , e, f] = item.transform;
    const length = Math.hypot(a, b) || 1;
    const dir = [a / length, b / length];
    const total = measure(item.str) || 1;
    const height = item.height || length;
    for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + needle.length)) {
      const start = (measure(item.str.slice(0, at)) / total) * item.width;
      const wide = (measure(item.str.slice(at, at + needle.length)) / total) * item.width;
      const down = height * 0.22;
      boxes.push({
        x: e + dir[0] * start + dir[1] * down,
        y: f + dir[1] * start - dir[0] * down,
        width: wide,
        height: height * 1.2,
        angle: (Math.atan2(dir[1], dir[0]) * 180) / Math.PI,
        baseline: { x: e + dir[0] * start, y: f + dir[1] * start },
        size: height,
      });
    }
  }
  return boxes;
}
