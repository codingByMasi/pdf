// Works out which pages to keep when some are marked for removal.
export function pagesToKeep(total, removed) {
  return Array.from({ length: total }, (_, index) => index)
    .filter((index) => !removed.has(index))
    .map((index) => ({ index }));
}

export function toggleRemoved(removed, index) {
  const next = new Set(removed);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  return next;
}
