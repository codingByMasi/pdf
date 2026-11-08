// Shrinks one JPG picture in the browser: scales it down and saves it again at lower quality.
import { jpegOrientation } from '../../../shared/lib/jpegOrientation.js';

export async function recompressJpeg(bytes, { maxSide, quality }) {
  // A sideways-marked photo would be turned by the browser but not by PDF readers, so leave it alone.
  if (jpegOrientation(bytes) > 1) return null;
  const url = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return null;
    return { bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
