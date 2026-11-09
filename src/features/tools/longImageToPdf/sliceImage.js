// Cuts a tall picture (like a phone screenshot of a whole web page) into A4-shaped slices, one per PDF page.
const PAGE_RATIO = (841.89 - 48) / (595.28 - 48); // height / width of the area inside an A4 page
const MAX_PAGES = 100;

// Returns [{ y, height }] slices that cover the whole picture. Throws errorKey when it would need too many pages.
export function planSlices(width, height) {
  const sliceHeight = Math.max(1, Math.round(width * PAGE_RATIO));
  const slices = [];
  for (let y = 0; y < height; y += sliceHeight) slices.push({ y, height: Math.min(sliceHeight, height - y) });
  if (slices.length > MAX_PAGES) throw Object.assign(new Error('too long'), { errorKey: 'error.imageTooLong' });
  return slices;
}

const toBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));

// bytes: a JPG or PNG picture. Returns [{ bytes, type: 'jpg' }] ready for the pictures-to-PDF job.
export async function sliceImage(bytes, mime, makeCanvas = () => document.createElement('canvas')) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const out = [];
    for (const slice of planSlices(image.naturalWidth, image.naturalHeight)) {
      const canvas = makeCanvas();
      canvas.width = image.naturalWidth;
      canvas.height = slice.height;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, slice.y, image.naturalWidth, slice.height, 0, 0, image.naturalWidth, slice.height);
      const blob = await toBlob(canvas);
      if (!blob) throw Object.assign(new Error('too big'), { errorKey: 'error.tooBig' });
      out.push({ bytes: new Uint8Array(await blob.arrayBuffer()), type: 'jpg' });
    }
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}
