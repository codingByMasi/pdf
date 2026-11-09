// Hides other files (any type) inside a PDF as attachments. PDF readers show them in an attachments panel.
import { loadPdf } from '../../../shared/lib/pdfLoad.js';

// files: [{ name, bytes, type }]. Returns the PDF bytes.
export async function attachFiles(bytes, files) {
  const doc = await loadPdf(bytes);
  for (const file of files) {
    await doc.attach(file.bytes, file.name, { mimeType: file.type || 'application/octet-stream', creationDate: new Date(), modificationDate: new Date() });
  }
  return doc.save();
}
