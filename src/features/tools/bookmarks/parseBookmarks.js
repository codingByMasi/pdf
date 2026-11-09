// Reads a typed list of bookmarks. Each line is "Title | page number", or one bookmark per page.
export function parseBookmarks(text, pageCount) {
  const items = [];
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return { errorKey: 'error.bookmarkEmpty' };
  for (let n = 0; n < lines.length; n += 1) {
    const cut = lines[n].lastIndexOf('|');
    const title = (cut >= 0 ? lines[n].slice(0, cut) : '').trim();
    const page = Number((cut >= 0 ? lines[n].slice(cut + 1) : '').trim());
    if (!title || !Number.isInteger(page) || page < 1 || page > pageCount) {
      return { errorKey: 'error.bookmarkBad', vars: { line: n + 1, count: pageCount } };
    }
    items.push({ title: title.slice(0, 200), page });
  }
  return { items };
}

export function pageBookmarks(pageCount, label) {
  return Array.from({ length: pageCount }, (_, i) => ({ title: `${label} ${i + 1}`, page: i + 1 }));
}
