// Plans for editing pages: start order, turn, move, mark for removal, and what is left to save.
export function startEdits(count) {
  return Array.from({ length: count }, (_, index) => ({ index, rotation: 0, removed: false }));
}

const wrap = (degrees) => (degrees + 360) % 360;

export function turnPage(edits, position, degrees) {
  return edits.map((edit, i) => (i === position ? { ...edit, rotation: wrap(edit.rotation + degrees) } : edit));
}

export function turnAll(edits, degrees) {
  return edits.map((edit) => ({ ...edit, rotation: wrap(edit.rotation + degrees) }));
}

export function movePage(edits, position, step) {
  const to = position + step;
  if (to < 0 || to >= edits.length) return edits;
  const copy = [...edits];
  [copy[position], copy[to]] = [copy[to], copy[position]];
  return copy;
}

export function toggleRemoved(edits, position) {
  return edits.map((edit, i) => (i === position ? { ...edit, removed: !edit.removed } : edit));
}

// The pages to save, in order, as { index, rotation } for the page builder.
export function keptPages(edits) {
  return edits.filter((edit) => !edit.removed).map(({ index, rotation }) => ({ index, rotation }));
}

export function hasChanges(edits) {
  return edits.some((edit, position) => edit.rotation !== 0 || edit.removed || edit.index !== position);
}
