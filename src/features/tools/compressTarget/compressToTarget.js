// Tries stronger and stronger shrinking until the file is at or under the wanted size.
export const STEPS = [
  { kind: 'images', maxSide: 2000, quality: 0.72 },
  { kind: 'images', maxSide: 1400, quality: 0.5 },
  { kind: 'pictures', scale: 1.6, quality: 0.6 },
  { kind: 'pictures', scale: 1.2, quality: 0.45 },
  { kind: 'pictures', scale: 0.9, quality: 0.35 },
];

// run(step) -> bytes. Returns { bytes, met, step } where bytes is the smallest result found.
export async function compressToTarget(original, targetBytes, run, onProgress) {
  if (original.length <= targetBytes) return { bytes: original, met: true, step: -1 };
  let best = original;
  let usedStep = -1;
  for (let i = 0; i < STEPS.length; i += 1) {
    const bytes = await run(STEPS[i], (v) => onProgress?.(((i + v / 100) / STEPS.length) * 100));
    if (bytes.length < best.length) {
      best = bytes;
      usedStep = i;
    }
    if (best.length <= targetBytes) return { bytes: best, met: true, step: usedStep };
  }
  return { bytes: best, met: false, step: usedStep };
}
