// Opens a picture file in the browser and saves a canvas as a picture file. Used by all the image tools.
export const FORMATS = {
  png: { mime: 'image/png', ext: 'png' },
  jpg: { mime: 'image/jpeg', ext: 'jpg' },
  webp: { mime: 'image/webp', ext: 'webp' },
};
const MAX_PIXELS = 60_000_000;

function bad(errorKey = 'error.imageBad') {
  return Object.assign(new Error(errorKey), { errorKey });
}

// Which of our formats a file is (by its type, then its name). PNG, JPG or WebP; anything else counts as JPG.
export function formatOf(file) {
  const text = `${file.type} ${file.name}`.toLowerCase();
  if (/png/.test(text)) return 'png';
  if (/webp/.test(text)) return 'webp';
  return 'jpg';
}

// Returns { element, width, height, url }. Call URL.revokeObjectURL(url) when done. Phone photos come out the right way up.
export async function loadImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const element = new Image();
    element.src = url;
    await element.decode();
    const width = element.naturalWidth;
    const height = element.naturalHeight;
    if (!width || !height) throw bad();
    if (width * height > MAX_PIXELS) throw bad('error.imageHuge');
    return { element, width, height, url };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error.errorKey ? error : bad();
  }
}

export function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

// Draws the picture onto a new canvas of the given size. fill: colour behind (needed for JPG so see-through parts become white).
export function drawImage(image, width, height, fill = null) {
  const canvas = makeCanvas(width, height);
  const context = canvas.getContext('2d');
  if (fill) {
    context.fillStyle = fill;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.imageSmoothingQuality = 'high';
  context.drawImage(image.element ?? image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Saves a canvas as a file. Returns { blob, ext } where ext tells the real format (some browsers cannot save WebP and give PNG).
export async function canvasToFile(canvas, format, quality = 0.9) {
  const wanted = FORMATS[format] ?? FORMATS.png;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, wanted.mime, quality));
  if (!blob) throw bad('error.imageBig');
  const real = Object.entries(FORMATS).find(([, f]) => f.mime === blob.type)?.[0] ?? format;
  return { blob, ext: FORMATS[real].ext, format: real };
}
