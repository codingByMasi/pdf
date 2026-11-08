// Turns a photo into a clean scanned page: turn it, crop it, and give it a document look.

// Changes picture pixels in place. mode: 'color' (nothing), 'gray', or 'bw' (white paper, dark writing).
export function filterPixels(data, mode) {
  if (mode === 'color') return data;
  const gray = new Uint8ClampedArray(data.length / 4);
  const histogram = new Uint32Array(256);
  for (let i = 0, g = 0; i < data.length; i += 4, g += 1) {
    gray[g] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[gray[g]] += 1;
  }
  let low = 0;
  let high = 255;
  if (mode === 'bw') {
    const at = (share) => {
      let sum = 0;
      for (let v = 0; v < 256; v += 1) {
        sum += histogram[v];
        if (sum >= gray.length * share) return v;
      }
      return 255;
    };
    low = at(0.03);
    high = Math.max(low + 20, at(0.6));
  }
  const range = high - low || 1;
  for (let i = 0, g = 0; i < data.length; i += 4, g += 1) {
    const v = mode === 'bw' ? Math.max(0, Math.min(255, ((gray[g] - low) / range) * 255)) : gray[g];
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
  }
  return data;
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

// options: { rotation: 0|90|180|270, cuts: {top,bottom,left,right} in percent, filter, maxSide }. Returns a JPEG Blob.
export async function renderScanPage(file, { rotation = 0, cuts, filter = 'color', maxSide = 2200 }) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    const turned = rotation % 180 !== 0;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    const full = makeCanvas((turned ? h : w) * scale, (turned ? w : h) * scale);
    const context = full.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, full.width, full.height);
    context.translate(full.width / 2, full.height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(image, (-w * scale) / 2, (-h * scale) / 2, w * scale, h * scale);

    const c = cuts ?? { top: 0, bottom: 0, left: 0, right: 0 };
    const sx = Math.round((full.width * c.left) / 100);
    const sy = Math.round((full.height * c.top) / 100);
    const sw = Math.max(1, full.width - sx - Math.round((full.width * c.right) / 100));
    const sh = Math.max(1, full.height - sy - Math.round((full.height * c.bottom) / 100));
    const out = makeCanvas(sw, sh);
    const outContext = out.getContext('2d');
    outContext.drawImage(full, sx, sy, sw, sh, 0, 0, sw, sh);
    if (filter !== 'color') {
      const pixels = outContext.getImageData(0, 0, out.width, out.height);
      filterPixels(pixels.data, filter);
      outContext.putImageData(pixels, 0, 0);
    }
    const blob = await new Promise((resolve) => out.toBlob(resolve, 'image/jpeg', 0.86));
    if (!blob) throw Object.assign(new Error('bad image'), { errorKey: 'error.imageBad' });
    return blob;
  } catch (error) {
    throw error.errorKey ? error : Object.assign(new Error('bad image'), { errorKey: 'error.imageBad' });
  } finally {
    URL.revokeObjectURL(url);
  }
}
