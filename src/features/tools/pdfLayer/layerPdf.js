// Puts the pages of one PDF on top of (or behind) the pages of another, like printing on letterhead paper.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { drawEmbedded, embedOrEmpty } from '../../../shared/lib/embedPage.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// Layer page n goes on main page n. If the layer has fewer pages, its last page is used again.
// position 'top' keeps the main file as it is (links and forms stay). 'behind' builds new pages, so links and forms are lost.
export async function layerPdf(mainBytes, layerBytes, { position }, onProgress) {
  const main = await loadPdf(mainBytes);
  const layer = await loadPdf(layerBytes);
  const layerPages = layer.getPages();
  const output = position === 'top' ? main : await createPdf();
  const mainPages = main.getPages();
  for (let i = 0; i < mainPages.length; i += 1) {
    const { width, height } = mainPages[i].getSize();
    const top = await embedOrEmpty(output, layerPages[Math.min(i, layerPages.length - 1)]);
    const area = { x: 0, y: 0, width, height };
    const fit = Math.min(width / top.width, height / top.height);
    const placed = { x: (width - top.width * fit) / 2, y: (height - top.height * fit) / 2, width: top.width * fit, height: top.height * fit };
    if (position === 'top') {
      drawEmbedded(mainPages[i], top, placed);
    } else {
      const under = await embedOrEmpty(output, mainPages[i]);
      const sheet = output.addPage([width, height]);
      drawEmbedded(sheet, top, placed);
      drawEmbedded(sheet, under, area);
    }
    onProgress?.(((i + 1) / mainPages.length) * 100);
    if (i % 10 === 9) await yieldToUi();
  }
  return output.save();
}
