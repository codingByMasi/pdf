// Reads a chosen picture file and, for phone photos stored sideways, turns it the right way up.
import { jpegOrientation } from '../../../shared/lib/jpegOrientation.js';
import { sniffImageType, sniffOtherImage } from '../../../shared/lib/sniffImage.js';

function badImage() {
  return Object.assign(new Error('bad image'), { errorKey: 'error.imageBad' });
}

// Browsers show the photo the right way up, so drawing it on a canvas gives upright pixels.
async function redrawUpright(bytes, mime = 'image/jpeg') {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) throw badImage();
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function prepareImageBytes(bytes) {
  const type = sniffImageType(bytes);
  if (!type) {
    // WebP and HEIC: let the browser open them, then save as JPG. Some browsers cannot open HEIC.
    const other = sniffOtherImage(bytes);
    if (!other) throw badImage();
    try {
      return { bytes: await redrawUpright(bytes, other === 'webp' ? 'image/webp' : 'image/heic'), type: 'jpg' };
    } catch {
      throw Object.assign(new Error('unsupported picture'), { errorKey: other === 'heic' ? 'error.heicUnsupported' : 'error.imageBad' });
    }
  }
  if (type === 'jpg' && jpegOrientation(bytes) > 1) {
    try {
      return { bytes: await redrawUpright(bytes), type: 'jpg' };
    } catch {
      throw badImage();
    }
  }
  return { bytes, type };
}

export async function prepareImage(file) {
  return prepareImageBytes(new Uint8Array(await file.arrayBuffer()));
}
