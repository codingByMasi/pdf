// Builds a one-page PDF with the same photo repeated on a sheet, with thin cut marks between photos.
import { rgb } from 'pdf-lib';
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { MM, PHOTO_SIZES, SHEETS, layoutPhotos } from './photoLayout.js';

// photo: JPEG bytes. options: { size: key of PHOTO_SIZES, sheet: key of SHEETS, copies: number|null }.
export async function makePhotoSheet(photo, { size, sheet, copies = null }) {
  const [w, h] = (PHOTO_SIZES[size] ?? PHOTO_SIZES['35x45']).map((v) => v * MM);
  const layout = layoutPhotos(SHEETS[sheet] ?? SHEETS.a4, [w, h], { copies });
  if (!layout) throw Object.assign(new Error('does not fit'), { errorKey: 'error.photoFit' });
  const doc = await createPdf();
  const image = await doc.embedJpg(photo);
  const page = doc.addPage(layout.sheet);
  for (const { x, y } of layout.positions) {
    page.drawImage(image, { x, y, width: w, height: h });
    page.drawRectangle({ x, y, width: w, height: h, borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 0.4 });
  }
  return { bytes: await doc.save(), count: layout.positions.length };
}
