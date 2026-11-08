// Breaks styled text into lines that fit a width. Works for English and Hindi together.
import { splitByScript } from './textScript.js';

const graphemes =
  typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

// Splits a word into letters that stay together (a Hindi letter and its marks are one).
function clusters(text) {
  if (graphemes) return Array.from(graphemes.segment(text), (part) => part.segment);
  const out = [];
  for (const char of text) {
    if (out.length && /[\p{M}‌‍]/u.test(char)) out[out.length - 1] += char;
    else out.push(char);
  }
  return out;
}

function toSegments(text, face) {
  return splitByScript(text).map((run) => ({ text: run.text, script: run.script, face }));
}

// A "unit" is a word or a stretch of spaces, made of one or more segments.
function toUnits(pieces) {
  const units = [];
  let word = null;
  let space = null;
  for (const piece of pieces) {
    for (const [part] of piece.text.matchAll(/ +|[^ ]+/g)) {
      const isSpace = part[0] === ' ';
      const segments = toSegments(part, piece.face);
      if (isSpace) {
        word = null;
        if (!space) units.push((space = { space: true, segments: [] }));
        space.segments.push(...segments);
      } else {
        space = null;
        if (!word) units.push((word = { space: false, segments: [] }));
        word.segments.push(...segments);
      }
    }
  }
  return units;
}

function measure(book, segments, size) {
  let sum = 0;
  for (const seg of segments) sum += book.width(seg.face, seg.script, seg.text, size);
  return sum;
}

// A word wider than the whole line is cut into pieces.
function breakWord(book, unit, size, maxWidth) {
  const parts = [];
  let current = [];
  let width = 0;
  for (const seg of unit.segments) {
    for (const cluster of clusters(seg.text)) {
      const w = book.width(seg.face, seg.script, cluster, size);
      if (width + w > maxWidth && current.length) {
        parts.push({ space: false, segments: current, width });
        current = [];
        width = 0;
      }
      const last = current[current.length - 1];
      if (last && last.face === seg.face && last.script === seg.script) last.text += cluster;
      else current.push({ text: cluster, script: seg.script, face: seg.face });
      width += w;
    }
  }
  if (current.length) parts.push({ space: false, segments: current, width });
  return parts;
}

// pieces: [{ text, face }] with no line breaks inside. Returns [{ segments, width }].
export function wrapPieces(book, pieces, size, maxWidth) {
  const lines = [];
  let line = { segments: [], width: 0 };
  const push = () => {
    lines.push(line);
    line = { segments: [], width: 0 };
  };
  const add = (unit) => {
    line.segments.push(...unit.segments);
    line.width += unit.width;
  };

  for (const unit of toUnits(pieces)) {
    unit.width = measure(book, unit.segments, size);
    if (unit.space) {
      if (line.segments.length) add(unit);
    } else if (line.width + unit.width <= maxWidth) add(unit);
    else if (unit.width <= maxWidth) {
      while (line.segments.at(-1) && /^ +$/.test(line.segments.at(-1).text)) {
        const spaces = line.segments.pop();
        line.width -= book.width(spaces.face, 'latin', spaces.text, size);
      }
      push();
      add(unit);
    } else {
      if (line.segments.length) push();
      for (const part of breakWord(book, unit, size, maxWidth)) {
        if (line.segments.length) push();
        add(part);
      }
    }
  }
  if (line.segments.length || !lines.length) push();
  return lines;
}

// Plain text with line breaks: each paragraph is wrapped on its own. Returns all lines in order.
export function wrapText(book, text, face, size, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) lines.push(...wrapPieces(book, [{ text: paragraph, face }], size, maxWidth));
  return lines;
}
