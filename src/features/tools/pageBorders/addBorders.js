// Puts white margins and/or a thin frame round every page, and can add a blank page after each page or at the end.
import { rgb } from 'pdf-lib';
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { drawEmbedded, embedOrEmpty } from '../../../shared/lib/embedPage.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const MM = 72 / 25.4;
export const FRAME_WIDTH = { none: 0, thin: 0.75, thick: 2.5 };

// options: { marginMm (0-40), frame: 'none'|'thin'|'thick', blank: 'none'|'each'|'end' }
export async function addBorders(bytes, { marginMm = 0, frame = 'none', blank = 'none' }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const margin = Math.max(0, Math.min(40, marginMm)) * MM;
  const line = FRAME_WIDTH[frame] ?? 0;
  const pages = source.getPages();
  let lastSize = [595.28, 841.89];

  for (let i = 0; i < pages.length; i += 1) {
    const embedded = await embedOrEmpty(output, pages[i]);
    lastSize = [embedded.width + margin * 2, embedded.height + margin * 2];
    const sheet = output.addPage(lastSize);
    drawEmbedded(sheet, embedded, { x: margin, y: margin });
    if (line > 0) {
      const inset = Math.max(line / 2 + 1, margin / 2);
      sheet.drawRectangle({ x: inset, y: inset, width: lastSize[0] - inset * 2, height: lastSize[1] - inset * 2, borderColor: rgb(0, 0, 0), borderWidth: line });
    }
    if (blank === 'each') output.addPage(lastSize);
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  if (blank === 'end') output.addPage(lastSize);
  return output.save();
}
