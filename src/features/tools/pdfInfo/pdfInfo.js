// Reads and writes the file info of a PDF: title, author, subject, keywords, creator and producer.
import { getPdfLib } from '../../../shared/lib/pdfLoad.js';

export const FIELDS = ['title', 'author', 'subject', 'keywords', 'creator', 'producer'];
const NAMES = { title: 'Title', author: 'Author', subject: 'Subject', keywords: 'Keywords', creator: 'Creator', producer: 'Producer' };

async function open(bytes) {
  const { PDFDocument } = await getPdfLib();
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (error) {
    if (/encrypt/i.test(`${error?.name} ${error?.message}`)) throw error;
    throw Object.assign(new Error('damaged file'), { errorKey: 'error.corrupt' });
  }
}

export async function readInfo(bytes) {
  const doc = await open(bytes);
  return {
    title: doc.getTitle() ?? '',
    author: doc.getAuthor() ?? '',
    subject: doc.getSubject() ?? '',
    keywords: doc.getKeywords() ?? '',
    creator: doc.getCreator() ?? '',
    producer: doc.getProducer() ?? '',
  };
}

// values: { title, ... }. Empty values remove that field. clearAll removes every field first.
export async function writeInfo(bytes, values, { clearAll = false } = {}) {
  const { PDFName, PDFHexString } = await getPdfLib();
  const doc = await open(bytes);
  const info = doc.getInfoDict();
  for (const field of FIELDS) {
    const text = clearAll ? '' : (values[field] ?? '').trim();
    if (text) info.set(PDFName.of(NAMES[field]), PDFHexString.fromText(text));
    else info.delete(PDFName.of(NAMES[field]));
  }
  if (clearAll) {
    info.delete(PDFName.of('CreationDate'));
    info.delete(PDFName.of('ModDate'));
  } else {
    doc.setModificationDate(new Date());
  }
  return doc.save({ useObjectStreams: false });
}
