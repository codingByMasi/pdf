// Removes the hidden details of a PDF: title, author, creator, producer, dates, and the extra XMP data block.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';

export const FIELDS_SHOWN = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate'];

// Which of the hidden details this PDF has: a list of field names.
export async function findMetadata(bytes) {
  const { PDFName } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const info = doc.getInfoDict();
  const found = FIELDS_SHOWN.filter((name) => info.has(PDFName.of(name)));
  if (doc.catalog.has(PDFName.of('Metadata'))) found.push('XMP');
  return found;
}

export async function cleanMetadata(bytes) {
  const { PDFName } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const info = doc.getInfoDict();
  for (const name of [...FIELDS_SHOWN, 'Trapped']) info.delete(PDFName.of(name));
  for (const key of ['Metadata', 'PieceInfo']) doc.catalog.delete(PDFName.of(key));
  // The library writes its own Producer and dates unless told not to, so save the file as it is.
  const out = await doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  return out;
}
