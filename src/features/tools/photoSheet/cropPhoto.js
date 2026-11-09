// Cuts a photo to the shape of a passport photo (at 300 dots per inch) and returns JPEG bytes. Keeps the top of tall photos, where heads usually are.
export async function cropPhoto(file, [widthMm, heightMm]) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const outW = Math.round((widthMm / 25.4) * 300);
    const outH = Math.round((heightMm / 25.4) * 300);
    const scale = Math.max(outW / image.naturalWidth, outH / image.naturalHeight);
    const srcW = outW / scale;
    const srcH = outH / scale;
    const sx = (image.naturalWidth - srcW) / 2;
    const sy = (image.naturalHeight - srcH) * 0.25;
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, outW, outH);
    context.drawImage(image, sx, sy, srcW, srcH, 0, 0, outW, outH);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) throw new Error('picture failed');
    return new Uint8Array(await blob.arrayBuffer());
  } catch (error) {
    throw Object.assign(new Error('bad picture'), { errorKey: error?.errorKey ?? 'error.imageBad' });
  } finally {
    URL.revokeObjectURL(url);
  }
}
