// Makes one PDF for each group of pages and packs them in a zip.
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { buildPdfFromPages } from '../../../shared/lib/pdfPages.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';

// groups: [[page numbers from 0], ...]; names: optional file name for each group. Returns { bytes: zip, parts }.
export async function splitByGroups(bytes, groups, names = [], onProgress) {
  const source = await loadPdf(bytes);
  const width = String(groups.length).length;
  const files = [];
  const used = new Set();
  for (let i = 0; i < groups.length; i += 1) {
    const data = await buildPdfFromPages(source, groups[i].map((index) => ({ index })));
    let base = (names[i] ?? '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (!base || used.has(base.toLowerCase())) base = `${base ? `${base} ` : ''}part`;
    let name = `${String(i + 1).padStart(width, '0')}-${base}`;
    while (used.has(name.toLowerCase())) name += '-';
    used.add(name.toLowerCase());
    files.push({ name: `${name}.pdf`, data });
    onProgress?.(((i + 1) / groups.length) * 100);
    await yieldToUi();
  }
  return { bytes: makeZip(files), parts: files.length };
}
