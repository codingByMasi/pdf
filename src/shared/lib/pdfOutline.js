// Reads the top-level bookmarks of a PDF and the page each one points to. Returns [{ title, page }] with pages starting at 0.
import { loadPdfjs } from './pdfjs.js';

export async function readOutlineStarts(file) {
  const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  try {
    const doc = await task.promise;
    const outline = (await doc.getOutline()) ?? [];
    const found = [];
    for (const item of outline) {
      try {
        const dest = typeof item.dest === 'string' ? await doc.getDestination(item.dest) : item.dest;
        if (!Array.isArray(dest)) continue;
        const page = typeof dest[0] === 'object' ? await doc.getPageIndex(dest[0]) : dest[0];
        if (Number.isInteger(page)) found.push({ title: item.title, page });
      } catch {
        // a bookmark that points nowhere is skipped
      }
    }
    return found;
  } finally {
    await task.destroy();
  }
}
