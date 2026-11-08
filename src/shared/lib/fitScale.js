// Picks a safe picture scale so big pages do not break the browser's canvas limits.
const MAX_SIDE = 4096;
const MAX_AREA = 16_000_000;

export function fitScale(width, height, wanted) {
  const bySide = MAX_SIDE / Math.max(width, height);
  const byArea = Math.sqrt(MAX_AREA / (width * height));
  return Math.max(0.1, Math.min(wanted, bySide, byArea));
}
