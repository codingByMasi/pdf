// Pulls the pictures out of a PDF with pdf.js and saves each as a PNG inside one zip.
import { loadPdfjs } from '../../../shared/lib/pdfjs.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';

const MAX_IMAGES = 300;
const MIN_SIDE = 24;

function getObject(page, name) {
  const store = name.startsWith('g_') ? page.commonObjs : page.objs;
  return new Promise((resolve) => {
    try {
      store.get(name, resolve);
    } catch {
      resolve(null);
    }
  });
}

// Quick fingerprint so the same logo repeated on every page is saved once.
function fingerprint(image) {
  const data = image.data;
  let sum = 0;
  if (data) for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / 512))) sum = (sum * 31 + data[i]) >>> 0;
  return `${image.width}x${image.height}:${sum}`;
}

// Turns pdf.js picture data into canvas pixels. kind 1 = black and white bits, 2 = RGB, 3 = RGBA.
export function toCanvas(image, makeCanvas = () => document.createElement('canvas')) {
  const { width, height } = image;
  const canvas = makeCanvas();
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (image.bitmap) {
    context.drawImage(image.bitmap, 0, 0);
    return canvas;
  }
  const pixels = context.createImageData(width, height);
  const out = pixels.data;
  const data = image.data;
  if (image.kind === 1) {
    const rowBytes = (width + 7) >> 3;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const on = (data[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1 ? 255 : 0;
        const at = (y * width + x) * 4;
        out[at] = out[at + 1] = out[at + 2] = on;
        out[at + 3] = 255;
      }
    }
  } else if (image.kind === 2) {
    for (let i = 0, o = 0; i < width * height; i += 1, o += 4) {
      out[o] = data[i * 3]; out[o + 1] = data[i * 3 + 1]; out[o + 2] = data[i * 3 + 2]; out[o + 3] = 255;
    }
  } else {
    out.set(data.subarray(0, out.length));
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

const toBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

// Returns { bytes: zip, count }. Throws errorKey 'error.noImages' when the file has no pictures.
export async function extractImages(file, onProgress) {
  const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  const doc = await task.promise;
  const files = [];
  const seen = new Set();
  try {
    for (let n = 1; n <= doc.numPages && files.length < MAX_IMAGES; n += 1) {
      const page = await doc.getPage(n);
      const list = await page.getOperatorList();
      for (let i = 0; i < list.fnArray.length && files.length < MAX_IMAGES; i += 1) {
        const op = list.fnArray[i];
        let image = null;
        if (op === pdfjs.OPS.paintImageXObject) image = await getObject(page, list.argsArray[i][0]);
        else if (op === pdfjs.OPS.paintInlineImageXObject) image = list.argsArray[i][0];
        if (!image || Math.min(image.width, image.height) < MIN_SIDE) continue;
        const key = fingerprint(image);
        if (seen.has(key)) continue;
        seen.add(key);
        const blob = await toBlob(toCanvas(image));
        if (!blob) continue;
        files.push({ name: `image-${String(files.length + 1).padStart(3, '0')}-page${n}.png`, data: new Uint8Array(await blob.arrayBuffer()) });
      }
      page.cleanup();
      onProgress?.((n / doc.numPages) * 100);
      await yieldToUi();
    }
  } finally {
    await task.destroy();
  }
  if (!files.length) throw Object.assign(new Error('no images'), { errorKey: 'error.noImages' });
  return { bytes: makeZip(files), count: files.length };
}
