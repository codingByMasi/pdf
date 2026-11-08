// Writes everything placed on pages (lines, boxes, text, pictures) into the PDF, even on turned pages.
import { degrees, LineCapStyle, rgb } from 'pdf-lib';
import { createFontBook } from '../../../shared/lib/fontBook.js';
import { pageGeometry } from '../../../shared/lib/pageGeometry.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { hasDeva } from '../../../shared/lib/textScript.js';
import { wrapPieces } from '../../../shared/lib/textWrap.js';

const LINE_GAP = 1.3;

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function drawTextItem(page, book, item, ctx) {
  const size = item.size * ctx.scale;
  item.text.split('\n').forEach((raw, i) => {
    const line = wrapPieces(book, [{ text: book.clean(raw), face: 'regular' }], size, 1e9)[0];
    let advance = 0;
    for (const seg of line.segments) {
      if (!/^ +$/.test(seg.text)) {
        const spot = ctx.toPoint(item.x + advance / ctx.scale, item.y + item.size * (1 + i * LINE_GAP));
        page.drawText(seg.text, { ...spot, size, font: book.font(seg.face, seg.script), color: hexToRgb(item.color), rotate: degrees(ctx.rotation) });
      }
      advance += book.width(seg.face, seg.script, seg.text, size);
    }
  });
}

async function drawItem(doc, page, book, item, ctx) {
  const S = ctx.scale;
  const turn = degrees(ctx.rotation);
  if (item.type === 'path' || item.type === 'line') {
    const points = item.type === 'line' ? [[item.x1, item.y1], [item.x2, item.y2]] : item.points;
    for (let i = 1; i < points.length; i += 1) {
      page.drawLine({
        start: ctx.toPoint(...points[i - 1]),
        end: ctx.toPoint(...points[i]),
        thickness: item.width * S,
        color: hexToRgb(item.color),
        lineCap: LineCapStyle.Round,
      });
    }
  } else if (item.type === 'rect' || item.type === 'ellipse') {
    const style = {
      rotate: turn,
      ...(item.fill ? { color: hexToRgb(item.fill), opacity: item.opacity } : {}),
      ...(item.stroke ? { borderColor: hexToRgb(item.stroke), borderWidth: item.width * S } : {}),
    };
    if (item.type === 'rect') {
      page.drawRectangle({ ...ctx.toPoint(item.x, item.y + item.h), width: item.w * S, height: item.h * S, ...style });
    } else {
      page.drawEllipse({ ...ctx.toPoint(item.x + item.w / 2, item.y + item.h / 2), xScale: (item.w * S) / 2, yScale: (item.h * S) / 2, ...style });
    }
  } else if (item.type === 'text') drawTextItem(page, book, item, ctx);
  else if (item.type === 'image') {
    const image = item.mime === 'image/png' ? await doc.embedPng(item.bytes) : await doc.embedJpg(item.bytes);
    page.drawImage(image, { ...ctx.toPoint(item.x, item.y + item.h), width: item.w * S, height: item.h * S, rotate: turn });
  }
}

// byPage: { [pageNumberFromZero]: [items] }. Returns { bytes, replaced }.
export async function applyOverlays(bytes, byPage, { loadBytes } = {}, onProgress) {
  const doc = await loadPdf(bytes);
  const texts = Object.values(byPage).flat().filter((item) => item.type === 'text').map((item) => item.text).join(' ');
  const book = texts ? await createFontBook(doc, { deva: hasDeva(texts), loadBytes }) : { replaced: 0 };
  const pages = doc.getPages();
  const numbers = Object.keys(byPage).map(Number).filter((n) => n >= 0 && n < pages.length);
  for (let k = 0; k < numbers.length; k += 1) {
    const page = pages[numbers[k]];
    const { shown, rotation, toPage } = pageGeometry(page);
    const ctx = { scale: shown.width, rotation, toPoint: (x, y) => toPage({ x: x * shown.width, y: shown.height - y * shown.width }) };
    for (const item of byPage[numbers[k]]) await drawItem(doc, page, book, item, ctx);
    onProgress?.(((k + 1) / numbers.length) * 100);
  }
  return { bytes: await doc.save(), replaced: book.replaced };
}

// Items sent to the worker: the on-screen picture address is not needed there.
export function itemsForWorker(byPage) {
  const out = {};
  for (const [page, items] of Object.entries(byPage)) out[page] = items.map(({ url, ...rest }) => rest);
  return out;
}
