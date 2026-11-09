// Draws a QR code: fixed patterns, the data, the best mask, and the format information. Returns a grid of true (dark) and false.
import { ALIGN, LEVELS, LEVEL_BITS } from './qrTables.js';
import { buildCodewords } from './qrData.js';
import { penalty } from './qrPenalty.js';

const MASKS = [
  (i, j) => (i + j) % 2 === 0,
  (i) => i % 2 === 0,
  (i, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
];

const bch = (value, poly) => {
  const digits = (n) => 32 - Math.clz32(n);
  let v = value << (digits(poly) - 1);
  while (digits(v) >= digits(poly)) v ^= poly << (digits(v) - digits(poly));
  return (value << (digits(poly) - 1)) | v;
};

function setFixed(grid, size, version) {
  const put = (r, c, v) => { if (r >= 0 && c >= 0 && r < size && c < size) grid[r][c] = v; };
  for (const [r0, c0] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        put(r0 + r, c0 + c, r >= 0 && r <= 6 && c >= 0 && c <= 6 && (edge || core));
      }
    }
  }
  const spots = ALIGN[version - 1];
  for (const r of spots) {
    for (const c of spots) {
      if (grid[r][c] !== null) continue;
      for (let dr = -2; dr <= 2; dr += 1) for (let dc = -2; dc <= 2; dc += 1) grid[r + dr][c + dc] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
    }
  }
  for (let i = 8; i < size - 8; i += 1) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
}

function setInfo(grid, size, version, level, mask, test) {
  const bits = bch((LEVEL_BITS[level] << 3) | mask, 0x537) ^ 0x5412;
  for (let i = 0; i < 15; i += 1) {
    const mod = !test && ((bits >> i) & 1) === 1;
    grid[i < 6 ? i : i < 8 ? i + 1 : size - 15 + i][8] = mod;
    grid[8][i < 8 ? size - i - 1 : i < 9 ? 15 - i : 15 - i - 1] = mod;
  }
  grid[size - 8][8] = !test;
  if (version >= 7) {
    const info = bch(version, 0x1f25);
    for (let i = 0; i < 18; i += 1) {
      const mod = !test && ((info >> i) & 1) === 1;
      grid[Math.floor(i / 3)][(i % 3) + size - 11] = mod;
      grid[(i % 3) + size - 11][Math.floor(i / 3)] = mod;
    }
  }
}

function place(grid, size, codewords, mask) {
  let inc = -1;
  let row = size - 1;
  let bit = 7;
  let at = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (;;) {
      for (let c = 0; c < 2; c += 1) {
        if (grid[row][col - c] !== null) continue;
        let dark = at < codewords.length && ((codewords[at] >>> bit) & 1) === 1;
        if (MASKS[mask](row, col - c)) dark = !dark;
        grid[row][col - c] = dark;
        bit -= 1;
        if (bit === -1) { at += 1; bit = 7; }
      }
      row += inc;
      if (row < 0 || row >= size) { row -= inc; inc = -inc; break; }
    }
  }
}

// level: 'L' | 'M' | 'Q' | 'H'. Returns boolean[][] (no quiet zone).
export function makeQr(text, level = 'M') {
  if (!LEVELS.includes(level)) level = 'M';
  const { version, codewords } = buildCodewords(text, level);
  const size = 17 + version * 4;
  let best = null;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask += 1) {
    const grid = Array.from({ length: size }, () => new Array(size).fill(null));
    setFixed(grid, size, version);
    setInfo(grid, size, version, level, mask, true);
    place(grid, size, codewords, mask);
    setInfo(grid, size, version, level, mask, false);
    const score = penalty(grid);
    if (score < bestScore) { best = grid; bestScore = score; }
  }
  return best;
}
