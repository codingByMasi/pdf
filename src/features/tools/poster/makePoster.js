// Prints one big page as a poster: each page is enlarged and cut into a grid of A4 or Letter sheets to stick together.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { PAPER, fitInBox } from '../../../shared/lib/pageSizes.js';
import { drawEmbedded, embedOrEmpty } from '../../../shared/lib/embedPage.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// grid: 2, 3 or 4 sheets across and down. paper: 'a4' | 'letter'.
export async function makePoster(bytes, { grid, paper }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const base = PAPER[paper];
  const pages = source.getPages();
  for (let i = 0; i < pages.length; i += 1) {
    const embedded = await embedOrEmpty(output, pages[i]);
    const sideways = embedded.width > embedded.height;
    const sheetW = sideways ? base.height : base.width;
    const sheetH = sideways ? base.width : base.height;
    const full = fitInBox(embedded.width, embedded.height, { x: 0, y: 0, width: sheetW * grid, height: sheetH * grid });
    for (let row = 0; row < grid; row += 1) {
      for (let column = 0; column < grid; column += 1) {
        const sheet = output.addPage([sheetW, sheetH]);
        drawEmbedded(sheet, embedded, {
          x: full.x - column * sheetW,
          y: full.y - (grid - 1 - row) * sheetH,
          width: embedded.width * full.scale,
          height: embedded.height * full.scale,
        });
      }
    }
    onProgress?.(((i + 1) / pages.length) * 100);
    await yieldToUi();
  }
  return output.save();
}
