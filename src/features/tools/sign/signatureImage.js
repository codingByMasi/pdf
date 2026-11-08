// Helpers that turn a canvas into a signature picture with clear (see-through) edges trimmed away.
export function trimCanvas(canvas) {
  const { width, height } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const pad = 6;
  const out = document.createElement('canvas');
  out.width = maxX - minX + 1 + 2 * pad;
  out.height = maxY - minY + 1 + 2 * pad;
  out.getContext('2d').drawImage(canvas, minX, minY, maxX - minX + 1, maxY - minY + 1, pad, pad, maxX - minX + 1, maxY - minY + 1);
  return out;
}

// Returns { bytes, mime, url, aspect } for a canvas, or null if it is empty.
export async function canvasToSignature(canvas) {
  const trimmed = trimCanvas(canvas);
  if (!trimmed) return null;
  const blob = await new Promise((resolve) => trimmed.toBlob(resolve, 'image/png'));
  if (!blob) return null;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), mime: 'image/png', url: URL.createObjectURL(blob), aspect: trimmed.height / trimmed.width };
}

// Writes a name in a flowing handwriting style (whatever script font the device has) on a clear canvas.
export function typedSignatureCanvas(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 360;
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.textBaseline = 'middle';
  let size = 190;
  const font = (px) => `italic ${px}px "Segoe Script", "Brush Script MT", "Lucida Handwriting", "Noto Sans Devanagari", cursive, serif`;
  context.font = font(size);
  while (context.measureText(text).width > canvas.width - 80 && size > 40) {
    size -= 10;
    context.font = font(size);
  }
  context.fillText(text, 40, canvas.height / 2);
  return canvas;
}
