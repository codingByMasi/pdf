// Tries to rescue a damaged PDF: reads what it can and copies the pages into a clean new file.
import { createPdf, getPdfLib } from '../../../shared/lib/pdfLoad.js';

// Returns { bytes, pages, lost } where lost is how many pages could not be copied.
export async function repairPdf(bytes) {
  const { PDFDocument } = await getPdfLib();
  let source;
  try {
    source = await PDFDocument.load(bytes, { throwOnInvalidObject: false, ignoreEncryption: false, updateMetadata: false });
  } catch (error) {
    if (/encrypt/i.test(`${error?.name} ${error?.message}`)) throw error;
    throw Object.assign(new Error('cannot read'), { errorKey: 'error.repairFailed' });
  }
  const output = await createPdf();
  let lost = 0;
  const count = source.getPageCount();
  for (let i = 0; i < count; i += 1) {
    try {
      const [page] = await output.copyPages(source, [i]);
      output.addPage(page);
    } catch {
      lost += 1;
    }
  }
  if (output.getPageCount() === 0) throw Object.assign(new Error('no pages'), { errorKey: 'error.repairFailed' });
  return { bytes: await output.save(), pages: output.getPageCount(), lost };
}
