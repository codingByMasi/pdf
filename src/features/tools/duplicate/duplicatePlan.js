// Plans which pages to copy: each chosen page is followed by its extra copies; other pages stay once.
export function duplicatePlan(pageCount, indices, copies) {
  const chosen = new Set(indices);
  const pages = [];
  for (let index = 0; index < pageCount; index += 1) {
    const times = chosen.has(index) ? 1 + copies : 1;
    for (let n = 0; n < times; n += 1) pages.push({ index });
  }
  return pages;
}
