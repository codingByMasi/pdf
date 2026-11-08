// Adds a slanted text watermark and/or page numbers to every page, even on turned pages.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { displaySize, displayToPage } from '../../../shared/lib/pagePlacement.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const NUMBER_SIZE = 12;
const NUMBER_BOTTOM = 20;
const NUMBER_SIDE = 36;

function badChars() {
  return Object.assign(new Error('unsupported letters'), { errorKey: 'error.watermarkChars' });
}

// options: { watermarkText: string, numbers: null | { position: 'center' | 'right', style: 'simple' | 'total' } }
export async function addMarks(bytes, options, onProgress) {
  const { StandardFonts, rgb, degrees } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = options.watermarkText.trim();
  if (text) {
    try {
      font.encodeText(text);
    } catch {
      throw badChars();
    }
  }

  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const rotation = (((page.getRotation().angle % 360) + 360) % 360);
    const box = page.getMediaBox();
    const shown = displaySize(width, height, rotation);
    const toPage = (point) => {
      const spot = displayToPage(point, { width, height, rotation });
      return { x: spot.x + box.x, y: spot.y + box.y };
    };

    if (text) {
      const unit = font.widthOfTextAtSize(text, 1);
      const size = Math.max(10, Math.min(160, (0.7 * Math.hypot(shown.width, shown.height)) / unit));
      const half = (unit * size) / 2;
      const angle = Math.PI / 4;
      const start = toPage({
        x: shown.width / 2 - half * Math.cos(angle) + size * 0.35 * Math.sin(angle),
        y: shown.height / 2 - half * Math.sin(angle) - size * 0.35 * Math.cos(angle),
      });
      page.drawText(text, { ...start, size, font, color: rgb(0.5, 0.5, 0.5), opacity: 0.3, rotate: degrees(45 + rotation) });
    }

    if (options.numbers) {
      const label = options.numbers.style === 'total' ? `${i + 1} / ${pages.length}` : String(i + 1);
      const labelWidth = font.widthOfTextAtSize(label, NUMBER_SIZE);
      const x = options.numbers.position === 'right' ? shown.width - NUMBER_SIDE - labelWidth : (shown.width - labelWidth) / 2;
      page.drawText(label, { ...toPage({ x, y: NUMBER_BOTTOM }), size: NUMBER_SIZE, font, color: rgb(0.2, 0.2, 0.2), rotate: degrees(rotation) });
    }

    onProgress?.(((i + 1) / pages.length) * 100);
    if (i % 5 === 4) await yieldToUi();
  }
  return doc.save();
}
