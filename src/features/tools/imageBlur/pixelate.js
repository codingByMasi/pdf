// Hides parts of a picture: swaps each part for big blocks (pixels) or a solid black box. Works on a canvas.
export function blockSize(w, h) {
  return Math.max(6, Math.round(Math.min(w, h) / 6));
}

// rects: boxes in pixels { x, y, w, h }. mode: 'pixel' or 'black'.
export function hideParts(canvas, rects, mode) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  for (const r of rects) {
    if (mode === 'black') {
      context.fillStyle = '#000000';
      context.fillRect(r.x, r.y, r.w, r.h);
      continue;
    }
    const size = blockSize(r.w, r.h);
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.ceil(r.w / size));
    small.height = Math.max(1, Math.ceil(r.h / size));
    const sc = small.getContext('2d');
    sc.imageSmoothingEnabled = true;
    sc.drawImage(canvas, r.x, r.y, r.w, r.h, 0, 0, small.width, small.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(small, 0, 0, small.width, small.height, r.x, r.y, r.w, r.h);
    context.imageSmoothingEnabled = true;
  }
}
