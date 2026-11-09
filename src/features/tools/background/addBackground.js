// Paints a colour behind every page. The page itself is placed on top, so its words stay as they were.
import { rgb } from 'pdf-lib';
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { drawEmbedded, embedOrEmpty } from '../../../shared/lib/embedPage.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

export const BACKGROUNDS = {
  cream: [0.99, 0.96, 0.86],
  yellow: [1, 0.98, 0.7],
  blue: [0.87, 0.93, 1],
  green: [0.88, 0.97, 0.89],
  grey: [0.92, 0.92, 0.92],
  pink: [1, 0.9, 0.93],
};

export async function addBackground(bytes, name, onProgress) {
  const colour = BACKGROUNDS[name];
  if (!colour) throw Object.assign(new Error('bad colour'), { errorKey: 'error.generic' });
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const pages = source.getPages();
  for (let i = 0; i < pages.length; i += 1) {
    const embedded = await embedOrEmpty(output, pages[i]);
    const sheet = output.addPage([embedded.width, embedded.height]);
    sheet.drawRectangle({ x: 0, y: 0, width: embedded.width, height: embedded.height, color: rgb(...colour) });
    drawEmbedded(sheet, embedded, { x: 0, y: 0 });
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return output.save();
}
