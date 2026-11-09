// Finds which words were added and removed between two texts (a simple longest-common-words match).
const LIMIT = 2_500_000;

const split = (text) => text.split(/\s+/).filter(Boolean);

// Returns { added: [words], removed: [words] }.
export function diffWords(before, after) {
  const a = split(before);
  const b = split(after);
  if (a.length * b.length > LIMIT) return countDiff(a, b);
  const width = b.length + 1;
  const table = new Uint16Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * width + j] = a[i] === b[j] ? table[(i + 1) * width + j + 1] + 1 : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
  }
  const added = [];
  const removed = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i += 1; j += 1; }
    else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) { removed.push(a[i]); i += 1; }
    else { added.push(b[j]); j += 1; }
  }
  while (i < a.length) removed.push(a[i++]);
  while (j < b.length) added.push(b[j++]);
  return { added, removed };
}

// Fallback for very long pages: compares word counts only (order is ignored).
function countDiff(a, b) {
  const seen = new Map();
  for (const word of a) seen.set(word, (seen.get(word) ?? 0) + 1);
  const added = [];
  for (const word of b) {
    if (seen.get(word) > 0) seen.set(word, seen.get(word) - 1);
    else added.push(word);
  }
  const removed = [];
  for (const [word, left] of seen) for (let n = 0; n < left; n += 1) removed.push(word);
  return { added, removed };
}

// pagesA, pagesB: arrays of page texts. Returns [{ page, added, removed, onlyIn }] for pages that differ.
export function comparePages(pagesA, pagesB) {
  const changes = [];
  const total = Math.max(pagesA.length, pagesB.length);
  for (let i = 0; i < total; i += 1) {
    const onlyIn = i >= pagesB.length ? 'first' : i >= pagesA.length ? 'second' : '';
    const { added, removed } = diffWords(pagesA[i] ?? '', pagesB[i] ?? '');
    if (added.length || removed.length) changes.push({ page: i + 1, added, removed, onlyIn });
  }
  return changes;
}
