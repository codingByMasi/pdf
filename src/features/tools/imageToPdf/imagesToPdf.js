// Puts pictures into a new PDF, one per page, either page-sized to the picture or on A4.
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 24;
const MAX_PAGE = 14400;

function pageFor(image, pageMode) {
  if (pageMode === 'a4') {
    const landscape = image.width > image.height;
    const page = landscape ? { width: A4.height, height: A4.width } : A4;
    const scale = Math.min((page.width - 2 * MARGIN) / image.width, (page.height - 2 * MARGIN) / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    return { page, x: (page.width - width) / 2, y: (page.height - height) / 2, width, height };
  }
  const shrink = Math.min(1, MAX_PAGE / (Math.max(image.width, image.height) * 0.75));
  const width = image.width * 0.75 * shrink;
  const height = image.height * 0.75 * shrink;
  return { page: { width, height }, x: 0, y: 0, width, height };
}

// images: [{ bytes, type: 'jpg' | 'png' }]. Returns the PDF as a Uint8Array.
export async function imagesToPdf(images, { pageMode = 'fit' } = {}, onProgress) {
  const doc = await createPdf();
  for (let i = 0; i < images.length; i += 1) {
    let embedded;
    try {
      embedded = images[i].type === 'png' ? await doc.embedPng(images[i].bytes) : await doc.embedJpg(images[i].bytes);
    } catch {
      throw Object.assign(new Error('bad image'), { errorKey: 'error.imageBad' });
    }
    const place = pageFor(embedded, pageMode);
    const page = doc.addPage([place.page.width, place.page.height]);
    page.drawImage(embedded, { x: place.x, y: place.y, width: place.width, height: place.height });
    onProgress?.(((i + 1) / images.length) * 100);
    await yieldToUi();
  }
  return doc.save();
}
