// Splits a PDF into parts that are each no bigger than a size limit (halving parts that are too big).
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';

// Returns { bytes: zip, parts, tooBig } where tooBig counts single pages that are still over the limit.
export async function splitBySize(bytes, maxBytes, onProgress) {
  const source = await loadPdf(bytes);
  const total = source.getPageCount();
  const parts = [];
  let tooBig = 0;
  let done = 0;

  async function cut(indices) {
    const data = await buildPdfFromPages(source, indices.map((index) => ({ index })));
    if (data.length <= maxBytes || indices.length === 1) {
      if (data.length > maxBytes) tooBig += 1;
      parts.push({ first: indices[0], data });
      done += indices.length;
      onProgress?.((done / total) * 100);
      await yieldToUi();
      return;
    }
    const middle = Math.ceil(indices.length / 2);
    await cut(indices.slice(0, middle));
    await cut(indices.slice(middle));
  }

  await cut(Array.from({ length: total }, (_, i) => i));
  const width = String(parts.length).length;
  const files = parts.map((part, n) => ({ name: `part-${String(n + 1).padStart(width, '0')}.pdf`, data: part.data }));
  return { bytes: makeZip(files), parts: parts.length, tooBig };
}
