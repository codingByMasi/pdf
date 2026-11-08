// Turns fill-in form fields into normal page content, so they can no longer be changed.
import { PDFName, PDFRef } from 'pdf-lib';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';

// pdf-lib leaves pages pointing at the removed field boxes. Remove those dead pointers.
function dropDeadAnnotations(doc) {
  for (const page of doc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = annots.size() - 1; i >= 0; i -= 1) {
      const item = annots.get(i);
      if (item instanceof PDFRef && !doc.context.lookup(item)) annots.remove(i);
    }
    if (annots.size() === 0) page.node.delete(PDFName.of('Annots'));
  }
}

// Returns { bytes, fields } where fields is how many form fields were flattened.
export async function flattenForms(bytes) {
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  const fields = form.getFields().length;
  if (fields > 0) {
    try {
      form.flatten();
      // Drop the now-empty form list, so no leftover pointers remain.
      doc.catalog.delete(PDFName.of('AcroForm'));
      dropDeadAnnotations(doc);
    } catch {
      throw Object.assign(new Error('flatten failed'), { errorKey: 'error.flattenForms' });
    }
  }
  return { bytes: await doc.save(), fields };
}
