// Loads pdf-lib only when a tool needs it, and opens or creates a PDF.
let libPromise;

export function getPdfLib() {
  libPromise ??= import('pdf-lib');
  return libPromise;
}

// Opens a PDF. Password files keep their error; anything else that fails is reported as damaged.
export async function loadPdf(bytes) {
  const { PDFDocument } = await getPdfLib();
  let doc;
  try {
    doc = await PDFDocument.load(bytes);
    if (doc.getPageCount() === 0) throw new Error('no pages');
  } catch (error) {
    if (/encrypt/i.test(`${error?.name} ${error?.message}`)) throw error;
    throw Object.assign(new Error('damaged file'), { errorKey: 'error.corrupt' });
  }
  return doc;
}

export async function createPdf() {
  const { PDFDocument } = await getPdfLib();
  return PDFDocument.create();
}
