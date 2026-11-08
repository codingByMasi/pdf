// Reads a chosen picture file and, for phone photos stored sideways, turns it the right way up.
import { jpegOrientation } from '../../../shared/lib/jpegOrientation.js';
import { sniffImageType } from '../../../shared/lib/sniffImage.js';

function badImage() {
  return Object.assign(new Error('bad image'), { errorKey: 'error.imageBad' });
}

// Browsers show the photo the right way up, so drawing it on a canvas gives upright pixels.
async function redrawUpright(bytes) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) throw badImage();
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function prepareImage(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImageType(bytes);
  if (!type) throw badImage();
  if (type === 'jpg' && jpegOrientation(bytes) > 1) {
    try {
      return { bytes: await redrawUpright(bytes), type: 'jpg' };
    } catch {
      throw badImage();
    }
  }
  return { bytes, type };
}
