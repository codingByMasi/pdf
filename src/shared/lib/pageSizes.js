// Standard paper sizes in PDF points (1 point = 1/72 inch), and a helper that fits a page into a box.
export const PAPER = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

// Returns { x, y, scale } that centres a page of (width x height) inside a box without cutting it.
export function fitInBox(width, height, box) {
  const scale = Math.min(box.width / width, box.height / height);
  return {
    scale,
    x: box.x + (box.width - width * scale) / 2,
    y: box.y + (box.height - height * scale) / 2,
  };
}
