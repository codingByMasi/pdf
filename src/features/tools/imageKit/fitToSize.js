// Finds the best picture quality (and, if needed, a smaller size) so the file is no bigger than the wanted size.
// encode(scale, quality) -> Promise<Blob|{size}>. Returns { blob, scale, quality, met }.
export async function fitToSize(encode, targetBytes, onProgress) {
  const scales = [1, 0.85, 0.7, 0.55, 0.4, 0.3, 0.2];
  let best = null;
  for (let s = 0; s < scales.length; s += 1) {
    let low = 0.35;
    let high = 0.95;
    let found = null;
    const top = await encode(scales[s], high);
    if (top.size <= targetBytes) found = { blob: top, scale: scales[s], quality: high };
    else {
      const bottom = await encode(scales[s], low);
      if (bottom.size <= targetBytes) {
        for (let i = 0; i < 6; i += 1) {
          const mid = (low + high) / 2;
          const blob = await encode(scales[s], mid);
          if (blob.size <= targetBytes) {
            found = { blob, scale: scales[s], quality: mid };
            low = mid;
          } else high = mid;
        }
        found ??= { blob: bottom, scale: scales[s], quality: low };
      } else if (!best || bottom.size < best.blob.size) best = { blob: bottom, scale: scales[s], quality: low };
    }
    onProgress?.(((s + 1) / scales.length) * 100);
    if (found) return { ...found, met: true };
  }
  return { ...best, met: false };
}
