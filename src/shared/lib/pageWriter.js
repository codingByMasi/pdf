// Writes lines of text onto pages and starts a new page when one is full.
const SIZES = { a4: [595.28, 841.89], 'a4-landscape': [841.89, 595.28] };

// layout: { size: 'a4' | 'a4-landscape', margin, maxPages }
export function createPageWriter(doc, book, { size = 'a4', margin = 56, maxPages = 4000 } = {}) {
  const [width, height] = SIZES[size];
  let page = null;
  let y = 0;

  const writer = {
    width,
    height,
    margin,
    contentWidth: width - 2 * margin,
    get page() {
      return page;
    },
    get y() {
      return y;
    },
    set y(value) {
      y = value;
    },
    get pageCount() {
      return doc.getPageCount();
    },
    newPage() {
      if (doc.getPageCount() >= maxPages) {
        throw Object.assign(new Error('too long'), { errorKey: 'error.textTooLong' });
      }
      page = doc.addPage([width, height]);
      y = height - margin;
      return page;
    },
    // Makes sure `needed` points are free below the cursor; otherwise starts a new page. Returns true if it did.
    ensure(needed) {
      if (!page || y - needed < margin) {
        writer.newPage();
        return true;
      }
      return false;
    },
    // Draws one wrapped line (from wrapPieces) with its top at the cursor, then moves the cursor down.
    drawLine(line, { x = margin, fontSize, lineHeight = 1.4, color }) {
      const step = fontSize * lineHeight;
      writer.ensure(step);
      let cursor = x;
      const baseline = y - fontSize * 1.05 - (step - fontSize * 1.2) / 2;
      for (const seg of line.segments) {
        if (!/^ +$/.test(seg.text)) {
          page.drawText(seg.text, { x: cursor, y: baseline, size: fontSize, font: book.font(seg.face, seg.script), color });
        }
        cursor += book.width(seg.face, seg.script, seg.text, fontSize);
      }
      y -= step;
    },
  };
  return writer;
}
