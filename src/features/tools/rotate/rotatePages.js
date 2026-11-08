// Plans for the rotate tool: start order, turn a page, move a page.
export function startEdits(count) {
  return Array.from({ length: count }, (_, index) => ({ index, rotation: 0 }));
}

export function turnPage(edits, position, degrees) {
  return edits.map((edit, i) => (i === position ? { ...edit, rotation: (edit.rotation + degrees + 360) % 360 } : edit));
}

export function movePage(edits, position, step) {
  const to = position + step;
  if (to < 0 || to >= edits.length) return edits;
  const copy = [...edits];
  [copy[position], copy[to]] = [copy[to], copy[position]];
  return copy;
}
