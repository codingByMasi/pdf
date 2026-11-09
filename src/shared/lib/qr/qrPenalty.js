// Scores a QR grid; the mask with the lowest score is the easiest to scan.
export function penalty(grid) {
  const n = grid.length;
  let score = 0;
  const lines = [];
  for (let i = 0; i < n; i += 1) {
    lines.push(grid[i]);
    lines.push(grid.map((r) => r[i]));
  }
  for (const line of lines) {
    let run = 1;
    for (let k = 1; k <= n; k += 1) {
      if (k < n && line[k] === line[k - 1]) run += 1;
      else { if (run >= 5) score += run - 2; run = 1; }
    }
    const text = line.map((v) => (v ? 1 : 0)).join('');
    for (let k = 0; k + 11 <= n; k += 1) {
      const part = text.slice(k, k + 11);
      if (part === '10111010000' || part === '00001011101') score += 40;
    }
  }
  for (let r = 0; r < n - 1; r += 1) {
    for (let c = 0; c < n - 1; c += 1) {
      const v = grid[r][c];
      if (v === grid[r][c + 1] && v === grid[r + 1][c] && v === grid[r + 1][c + 1]) score += 3;
    }
  }
  const dark = grid.flat().filter(Boolean).length;
  score += Math.floor(Math.abs((dark * 100) / (n * n) - 50) / 5) * 10;
  return score;
}
