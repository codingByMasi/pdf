// Compares two texts line by line. Returns a list of { type: 'same' | 'add' | 'remove', text }.
export const MAX_LINES = 3000;

export function diffLines(a, b) {
  const x = a.split('\n');
  const y = b.split('\n');
  if (x.length > MAX_LINES || y.length > MAX_LINES) return { errorKey: 'diff.tooBig' };
  const n = x.length;
  const m = y.length;
  const table = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) table[i][j] = x[i] === y[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) { out.push({ type: 'same', text: x[i] }); i += 1; j += 1; }
    else if (table[i + 1][j] >= table[i][j + 1]) { out.push({ type: 'remove', text: x[i] }); i += 1; }
    else { out.push({ type: 'add', text: y[j] }); j += 1; }
  }
  while (i < n) { out.push({ type: 'remove', text: x[i] }); i += 1; }
  while (j < m) { out.push({ type: 'add', text: y[j] }); j += 1; }
  return { lines: out };
}
