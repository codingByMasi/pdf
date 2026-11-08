// Crops every page by cutting a percentage off each side. The cut parts are hidden, not erased.
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

export const MAX_CUT = 45;

// cuts: { top, bottom, left, right } as percentages (0 to 45) of the page as you see it.
export async function cropPdf(bytes, cuts, onProgress) {
  const values = [cuts.top, cuts.bottom, cuts.left, cuts.right];
  if (values.some((v) => !(v >= 0 && v <= MAX_CUT)) || cuts.top + cuts.bottom >= 90 || cuts.left + cuts.right >= 90) {
    throw Object.assign(new Error('bad cut'), { errorKey: 'error.cropTooBig' });
  }
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i += 1) {
    const { shown, toPage } = pageGeometry(pages[i]);
    // Two opposite corners of the kept area, as you see the page, turned into spots in the file.
    const a = toPage({ x: (shown.width * cuts.left) / 100, y: (shown.height * cuts.bottom) / 100 });
    const b = toPage({ x: shown.width * (1 - cuts.right / 100), y: shown.height * (1 - cuts.top / 100) });
    pages[i].setCropBox(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 50 === 49) await yieldToUi();
  }
  return doc.save();
}
