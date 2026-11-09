// Works out which pages belong together when a PDF is cut at bookmarks or at blank pages.

// starts: sorted page numbers where a new part begins. Returns [[page, page, ...], ...].
export function groupsFromStarts(starts, pageCount) {
  const cuts = [...new Set([0, ...starts.filter((n) => n > 0 && n < pageCount)])].sort((a, b) => a - b);
  return cuts.map((from, i) => Array.from({ length: (cuts[i + 1] ?? pageCount) - from }, (_, k) => from + k));
}

// blank: set or array of blank page numbers. Blank pages are dropped; each run of other pages is one part.
export function groupsFromBlanks(blank, pageCount) {
  const empty = new Set(blank);
  const groups = [];
  let current = [];
  for (let i = 0; i < pageCount; i += 1) {
    if (empty.has(i)) {
      if (current.length) groups.push(current);
      current = [];
    } else current.push(i);
  }
  if (current.length) groups.push(current);
  return groups;
}
