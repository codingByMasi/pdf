// Adds a clickable bookmark list (the side menu of PDF readers). Replaces any bookmarks the file had.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';

// items: [{ title, page }] with page starting at 1.
export async function addBookmarks(bytes, items) {
  const { PDFName, PDFHexString } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const context = doc.context;
  const pages = doc.getPages();
  const rootRef = context.nextRef();
  const refs = items.map(() => context.nextRef());
  items.forEach((item, i) => {
    const entry = context.obj({
      Title: PDFHexString.fromText(item.title),
      Parent: rootRef,
      Dest: [pages[item.page - 1].ref, 'Fit'],
      ...(i > 0 ? { Prev: refs[i - 1] } : {}),
      ...(i < items.length - 1 ? { Next: refs[i + 1] } : {}),
    });
    context.assign(refs[i], entry);
  });
  context.assign(rootRef, context.obj({ Type: 'Outlines', First: refs[0], Last: refs[refs.length - 1], Count: items.length }));
  doc.catalog.set(PDFName.of('Outlines'), rootRef);
  doc.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
  return doc.save();
}
