// Cuts every page into two halves (left and right, or top and bottom), so a scanned two-page spread becomes two pages.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// Which part of the unturned page is the visual first / second half, for each page turn (0, 90, 180, 270).
// cut 'vertical' = a line down the middle (left | right); 'horizontal' = a line across (top / bottom).
// Each part is [axis, half]: axis 'x' or 'y' of the unturned page, half 0 = low side, 1 = high side.
const PARTS = {
  vertical: { 0: [['x', 0], ['x', 1]], 90: [['y', 0], ['y', 1]], 180: [['x', 1], ['x', 0]], 270: [['y', 1], ['y', 0]] },
  horizontal: { 0: [['y', 1], ['y', 0]], 90: [['x', 0], ['x', 1]], 180: [['y', 0], ['y', 1]], 270: [['x', 1], ['x', 0]] },
};

function halfBox(box, [axis, half]) {
  if (axis === 'x') {
    const width = box.width / 2;
    return { x: box.x + half * width, y: box.y, width, height: box.height };
  }
  const height = box.height / 2;
  return { x: box.x, y: box.y + half * height, width: box.width, height };
}

export async function halvePages(bytes, { cut }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const count = source.getPageCount();
  for (let i = 0; i < count; i += 1) {
    const turn = ((source.getPage(i).getRotation().angle % 360) + 360) % 360;
    const parts = PARTS[cut][turn] ?? PARTS[cut][0];
    for (const part of parts) {
      const [copy] = await output.copyPages(source, [i]);
      const box = halfBox(copy.getMediaBox(), part);
      copy.setMediaBox(box.x, box.y, box.width, box.height);
      copy.setCropBox(box.x, box.y, box.width, box.height);
      output.addPage(copy);
    }
    onProgress?.(((i + 1) / count) * 100);
    if (i % 10 === 9) await yieldToUi();
  }
  return output.save();
}
