// Builds a new PDF from chosen pages of an open PDF, in order, with optional extra turns.
import { createPdf, getPdfLib } from './pdfLoad.js';
import { yieldToUi } from './yieldToUi.js';

// pages: [{ index, rotation }] where rotation is extra degrees (0, 90, 180, 270).
export async function buildPdfFromPages(source, pages, onProgress) {
  const { degrees } = await getPdfLib();
  const output = await createPdf();
  for (let i = 0; i < pages.length; i += 1) {
    const { index, rotation = 0 } = pages[i];
    const [copy] = await output.copyPages(source, [index]);
    const turn = (source.getPage(index).getRotation().angle + rotation) % 360;
    copy.setRotation(degrees(((turn % 360) + 360) % 360));
    output.addPage(copy);
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return output.save();
}
