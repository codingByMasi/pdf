// Puts pages on new sheets: several pages per sheet (for printing), or every page fitted to A4 or Letter.
import { createPdf } from '../../../shared/lib/pdfLoad.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { PAPER, fitInBox } from '../../../shared/lib/pageSizes.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const MARGIN = 14;

async function embedAll(source, output) {
  const pages = source.getPages();
  const embedded = [];
  for (let i = 0; i < pages.length; i += 1) {
    embedded.push(...(await output.embedPages([pages[i]])));
    if (i % 10 === 9) await yieldToUi();
  }
  return embedded;
}

function drawFitted(sheet, embedded, box) {
  const { x, y, scale } = fitInBox(embedded.width, embedded.height, box);
  sheet.drawPage(embedded, { x, y, width: embedded.width * scale, height: embedded.height * scale });
}

// perSheet: 2 (side by side, landscape sheet) or 4 (2 x 2, portrait sheet). paper: 'a4' | 'letter'.
export async function nUp(bytes, { perSheet, paper }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const embedded = await embedAll(source, output);
  const base = PAPER[paper];
  const sheetSize = perSheet === 2 ? [base.height, base.width] : [base.width, base.height];
  const [columns, rows] = perSheet === 2 ? [2, 1] : [2, 2];
  const cellW = (sheetSize[0] - MARGIN * (columns + 1)) / columns;
  const cellH = (sheetSize[1] - MARGIN * (rows + 1)) / rows;
  for (let start = 0; start < embedded.length; start += perSheet) {
    const sheet = output.addPage(sheetSize);
    embedded.slice(start, start + perSheet).forEach((page, n) => {
      const column = n % columns;
      const row = Math.floor(n / columns);
      drawFitted(sheet, page, {
        x: MARGIN + column * (cellW + MARGIN),
        y: sheetSize[1] - MARGIN - (row + 1) * cellH - row * MARGIN,
        width: cellW,
        height: cellH,
      });
    });
    onProgress?.(Math.min(100, ((start + perSheet) / embedded.length) * 100));
  }
  return output.save();
}

// Every page goes on its own A4 or Letter sheet, in the same direction (upright or sideways) as before.
export async function resizePages(bytes, { paper }, onProgress) {
  const source = await loadPdf(bytes);
  const output = await createPdf();
  const originals = source.getPages();
  const embedded = await embedAll(source, output);
  const base = PAPER[paper];
  let turned = 0;
  embedded.forEach((page, i) => {
    if (originals[i].getRotation().angle % 360 !== 0) turned += 1;
    const sideways = page.width > page.height;
    const size = sideways ? [base.height, base.width] : [base.width, base.height];
    drawFitted(output.addPage(size), page, { x: 0, y: 0, width: size[0], height: size[1] });
    onProgress?.(((i + 1) / embedded.length) * 100);
  });
  return { bytes: await output.save(), turned };
}
