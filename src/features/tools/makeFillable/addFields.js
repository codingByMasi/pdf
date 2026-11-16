// Adds real fill-in fields (text boxes, tick boxes, drop-down lists) to a PDF, at the places the person marked.
import { degrees } from 'pdf-lib';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';

// Field names and list words use plain Latin letters only (the built-in font cannot show other scripts).
const safeName = (text) => text.replace(/[^A-Za-z0-9_ -]/g, '').trim().slice(0, 40);
const safeWord = (text) => text.replace(/[^ -ÿ]/g, '?').trim();

export function parseOptions(text) {
  const seen = new Set();
  const list = [];
  for (const raw of String(text ?? '').split('\n')) {
    const word = safeWord(raw);
    if (word && !seen.has(word)) {
      seen.add(word);
      list.push(word);
    }
  }
  return list.length ? list : ['Option 1', 'Option 2'];
}

// byPage: { [page from 0]: [{ type: 'field', fieldKind: 'text' | 'check' | 'dropdown', name, options, x, y, w, h }]. Returns { bytes, count }.
export async function addFields(bytes, byPage, onProgress) {
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  const used = new Set(form.getFields().map((field) => field.getName()));
  const pages = doc.getPages();
  const numbers = Object.keys(byPage).map(Number).filter((n) => n >= 0 && n < pages.length).sort((a, b) => a - b);
  let count = 0;
  for (let k = 0; k < numbers.length; k += 1) {
    const page = pages[numbers[k]];
    const { shown, rotation, toPage } = pageGeometry(page);
    const S = shown.width;
    for (const item of byPage[numbers[k]].filter((it) => it.type === 'field')) {
      count += 1;
      const base = safeName(item.name ?? '') || `${item.fieldKind}${count}`;
      let name = base;
      for (let n = 2; used.has(name); n += 1) name = `${base}_${n}`;
      used.add(name);
      const a = toPage({ x: item.x * S, y: shown.height - (item.y + item.h) * S });
      const b = toPage({ x: (item.x + item.w) * S, y: shown.height - item.y * S });
      const box = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y), rotate: degrees(rotation) };
      if (item.fieldKind === 'check') form.createCheckBox(name).addToPage(page, box);
      else if (item.fieldKind === 'dropdown') {
        const field = form.createDropdown(name);
        field.addOptions(parseOptions(item.options));
        field.addToPage(page, box);
      } else form.createTextField(name).addToPage(page, box);
    }
    onProgress?.(((k + 1) / numbers.length) * 100);
  }
  return { bytes: await doc.save(), count };
}
