// Reads page text like "1-3, 5" into page numbers, or returns a text key for the problem.
export function parsePageRange(text, pageCount) {
  const clean = text.replace(/\s+/g, '');
  if (!clean) return { errorKey: 'error.rangeEmpty' };
  const wanted = new Set();
  for (const part of clean.split(',')) {
    const match = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!match) return { errorKey: 'error.rangeBad' };
    const start = Number(match[1]);
    const end = match[2] === undefined ? start : Number(match[2]);
    if (start < 1 || end < start) return { errorKey: 'error.rangeBad' };
    if (end > pageCount) return { errorKey: 'error.rangeOutside', vars: { count: pageCount } };
    for (let page = start; page <= end; page += 1) wanted.add(page - 1);
  }
  return { indices: [...wanted].sort((a, b) => a - b) };
}
