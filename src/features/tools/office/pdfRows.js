// Groups the pieces of text on a PDF page into rows (top to bottom) and cells (left to right). Rough: it guesses from the positions.
export function rowsFromItems(items) {
  const list = items
    .filter((it) => it.str.trim() !== '')
    .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width, h: Math.abs(it.height) || Math.abs(it.transform[3]) || 10 }))
    .sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  for (const item of list) {
    const row = rows.at(-1);
    if (row && Math.abs(row.y - item.y) <= Math.max(2, row.h * 0.5)) row.items.push(item);
    else rows.push({ y: item.y, h: item.h, items: [item] });
  }
  return rows.map((row) => {
    const cells = [];
    let last = null;
    for (const it of row.items.sort((a, b) => a.x - b.x)) {
      const gap = last ? it.x - (last.x + last.w) : 0;
      if (last && gap < row.h * 0.6) {
        cells[cells.length - 1] += (gap > row.h * 0.15 ? ' ' : '') + it.str;
      } else cells.push(it.str);
      last = it;
    }
    return cells.map((c) => c.trim()).filter(Boolean);
  }).filter((cells) => cells.length > 0);
}
