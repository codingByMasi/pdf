// Finds files attached inside a PDF (the attachments panel) and gives them back.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';

// Returns [{ name, data }]. Names are made unique.
export async function extractAttachments(bytes) {
  const lib = await getPdfLib();
  const { PDFName, PDFDict, PDFArray, PDFRawStream, PDFString, PDFHexString, decodePDFRawStream } = lib;
  const doc = await loadPdf(bytes);
  const found = [];

  const textOf = (value) => (value instanceof PDFString || value instanceof PDFHexString ? value.decodeText() : '');
  function readSpec(spec) {
    if (!(spec instanceof PDFDict)) return;
    const stream = spec.lookupMaybe(PDFName.of('EF'), PDFDict)?.lookup(PDFName.of('F'));
    if (!(stream instanceof PDFRawStream)) return;
    const name = textOf(spec.lookup(PDFName.of('UF'))) || textOf(spec.lookup(PDFName.of('F'))) || `attachment-${found.length + 1}`;
    found.push({ name: name.replace(/[\\/:*?"<>|]+/g, '_'), data: decodePDFRawStream(stream).decode() });
  }
  function walk(node, depth = 0) {
    if (!(node instanceof PDFDict) || depth > 8) return;
    const names = node.lookupMaybe(PDFName.of('Names'), PDFArray);
    if (names) for (let i = 1; i < names.size(); i += 2) readSpec(names.lookup(i));
    const kids = node.lookupMaybe(PDFName.of('Kids'), PDFArray);
    if (kids) for (let i = 0; i < kids.size(); i += 1) walk(kids.lookup(i), depth + 1);
  }
  walk(doc.catalog.lookupMaybe(PDFName.of('Names'), PDFDict)?.lookupMaybe(PDFName.of('EmbeddedFiles'), PDFDict));

  for (const page of doc.getPages()) {
    const annots = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i += 1) {
      const annot = annots.lookup(i);
      if (annot instanceof PDFDict && annot.lookup(PDFName.of('Subtype')) === PDFName.of('FileAttachment')) readSpec(annot.lookup(PDFName.of('FS')));
    }
  }
  const used = new Map();
  return found.map((file) => {
    const count = used.get(file.name) ?? 0;
    used.set(file.name, count + 1);
    const dot = file.name.lastIndexOf('.');
    const name = count === 0 ? file.name : dot > 0 ? `${file.name.slice(0, dot)}-${count + 1}${file.name.slice(dot)}` : `${file.name}-${count + 1}`;
    return { name, data: file.data };
  });
}
