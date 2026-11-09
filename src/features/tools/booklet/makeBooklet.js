// Builds the booklet: two pages side by side on each landscape sheet, in the order for folding.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { PAPER, fitInBox } from '../../../shared/lib/pageSizes.js';
import { drawEmbedded, embedOrEmpty } from '../../../shared/lib/embedPage.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';
import { bookletSides } from './bookletOrder.js';

export async function makeBooklet(bytes, { paper = 'a4' }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const pages = source.getPages();
  const embedded = [];
  for (let i = 0; i < pages.length; i += 1) {
    embedded.push(await embedOrEmpty(output, pages[i]));
    if (i % 10 === 9) await yieldToUi();
  }
  const sheet = [PAPER[paper].height, PAPER[paper].width];
  const half = sheet[0] / 2;
  const sides = bookletSides(pages.length);
  sides.forEach((pair, n) => {
    const side = output.addPage(sheet);
    pair.forEach((index, column) => {
      if (index === null) return;
      const page = embedded[index];
      const { x, y, scale } = fitInBox(page.width, page.height, { x: column * half + 10, y: 10, width: half - 20, height: sheet[1] - 20 });
      drawEmbedded(side, page, { x, y, width: page.width * scale, height: page.height * scale });
    });
    onProgress?.(((n + 1) / sides.length) * 100);
  });
  return output.save();
}
