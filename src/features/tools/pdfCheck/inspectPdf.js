// Looks inside a PDF and reports facts: version, pages and sizes, fonts, pictures, forms, bookmarks, attachments, scripts, lock.
import { getPdfLib } from '../../../shared/lib/pdfLoad.js';

const POINTS_PER_MM = 72 / 25.4;
const KNOWN = [['A4', 210, 297], ['A3', 297, 420], ['A5', 148, 210], ['Letter', 215.9, 279.4], ['Legal', 215.9, 355.6]];

export function paperName(width, height) {
  const w = width / POINTS_PER_MM;
  const h = height / POINTS_PER_MM;
  const [short, long] = w < h ? [w, h] : [h, w];
  const found = KNOWN.find(([, a, b]) => Math.abs(a - short) < 3 && Math.abs(b - long) < 3);
  return found ? found[0] : `${Math.round(short)} × ${Math.round(long)} mm`;
}

// Returns a plain object of facts (no secrets): { version, pages, sizes: [{ name, count }], fonts: [{ name, embedded }], images, forms, bookmarks, attachments, scripts, encrypted }.
export async function inspectPdf(bytes) {
  const lib = await getPdfLib();
  const { PDFDocument, PDFName, PDFDict, PDFArray, PDFRawStream } = lib;
  const head = new TextDecoder('latin1').decode(bytes.slice(0, 16));
  const version = /%PDF-(\d\.\d)/.exec(head)?.[1] ?? '';
  const encrypted = /\/Encrypt\b/.test(new TextDecoder('latin1').decode(bytes.slice(Math.max(0, bytes.length - 4096))));
  let doc;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  } catch {
    throw Object.assign(new Error('damaged file'), { errorKey: 'error.corrupt' });
  }
  const sizes = new Map();
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const name = paperName(width, height);
    sizes.set(name, (sizes.get(name) ?? 0) + 1);
  }
  const fonts = new Map();
  let images = 0;
  let scripts = false;
  for (const [, object] of doc.context.enumerateIndirectObjects()) {
    const dict = object instanceof PDFRawStream ? object.dict : object instanceof PDFDict ? object : null;
    if (!dict) continue;
    const type = dict.get(PDFName.of('Type'));
    if (object instanceof PDFRawStream && dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) images += 1;
    if (type === PDFName.of('FontDescriptor')) {
      const raw = String(dict.get(PDFName.of('FontName')) ?? '').replace(/^\//, '').replace(/^[A-Z]{6}\+/, '');
      const embedded = ['FontFile', 'FontFile2', 'FontFile3'].some((key) => dict.has(PDFName.of(key)));
      if (raw && !fonts.has(raw)) fonts.set(raw, embedded);
    } else if (type === PDFName.of('Font') && dict.get(PDFName.of('Subtype')) !== PDFName.of('Type0') && !dict.has(PDFName.of('FontDescriptor'))) {
      const raw = String(dict.get(PDFName.of('BaseFont')) ?? '').replace(/^\//, '');
      if (raw && !fonts.has(raw)) fonts.set(raw, false);
    }
    if (dict.has(PDFName.of('JS'))) scripts = true;
  }
  const catalog = doc.catalog;
  const acro = catalog.lookupMaybe(PDFName.of('AcroForm'), PDFDict);
  const fields = acro?.lookupMaybe(PDFName.of('Fields'), PDFArray);
  const names = catalog.lookupMaybe(PDFName.of('Names'), PDFDict);
  return {
    version,
    pages: doc.getPageCount(),
    sizes: [...sizes].map(([name, count]) => ({ name, count })),
    fonts: [...fonts].map(([name, embedded]) => ({ name, embedded })),
    images,
    forms: fields ? fields.size() : 0,
    bookmarks: catalog.has(PDFName.of('Outlines')),
    attachments: Boolean(names?.has(PDFName.of('EmbeddedFiles'))),
    scripts: scripts || catalog.has(PDFName.of('OpenAction')) && JSON.stringify(String(catalog.get(PDFName.of('OpenAction')))).includes('JavaScript'),
    encrypted,
  };
}
