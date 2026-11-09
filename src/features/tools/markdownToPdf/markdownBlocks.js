// Reads simple Markdown (headings, lists, quotes, code, tables, bold, links) into the same blocks the HTML tool draws.
const BULLET = /^(\s*)([-*+])\s+(.*)$/;
const ORDERED = /^(\s*)(\d+)[.)]\s+(.*)$/;

// Turns inline marks into plain runs: **bold** is bold; code, italics and links lose their marks.
export function inlineRuns(text) {
  const runs = [];
  const plain = text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, '$1 ($2)')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(^|[^*_])[*_]([^*_\s][^*_]*)[*_](?!\w)/g, '$1$2');
  const parts = plain.split(/(\*\*[^*]+\*\*|__[^_]+__)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(part)) runs.push({ text: part.slice(2, -2), bold: true });
    else runs.push({ text: part, bold: false });
  }
  return runs.length ? runs : [{ text: '', bold: false }];
}

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
const isDivider = (line) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line) && line.includes('-');

// Returns { blocks, skippedImages }.
export function markdownToBlocks(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let skippedImages = (source.match(/!\[[^\]]*\]\([^)]*\)/g) ?? []).length;

  const flush = (extra = {}) => {
    if (paragraph.length) blocks.push({ kind: 'para', runs: inlineRuns(paragraph.join(' ')), ...extra });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      flush();
      const code = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      blocks.push({ kind: 'pre', text: code.join('\n') });
    } else if (/^\s*$/.test(line)) flush();
    else if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) { flush(); blocks.push({ kind: 'rule' }); }
    else if (/^\s{0,3}#{1,6}\s/.test(line)) {
      flush();
      const level = line.trim().match(/^#+/)[0].length;
      blocks.push({ kind: 'heading', level, runs: inlineRuns(line.trim().replace(/^#+\s*/, '').replace(/\s*#+\s*$/, '')).map((r) => ({ ...r, bold: true })) });
    } else if (line.includes('|') && i + 1 < lines.length && isDivider(lines[i + 1])) {
      flush();
      const rows = [cells(line)];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(cells(lines[i++]));
      i -= 1;
      blocks.push({ kind: 'table', rows });
    } else if (/^\s*>/.test(line)) {
      flush();
      const quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ''));
      i -= 1;
      blocks.push({ kind: 'para', runs: inlineRuns(quote.join(' ')), quote: true });
    } else if (BULLET.test(line) || ORDERED.test(line)) {
      flush();
      const m = BULLET.exec(line) ?? ORDERED.exec(line);
      const marker = BULLET.test(line) ? '•' : `${m[2]}.`;
      blocks.push({ kind: 'item', marker, depth: Math.min(3, Math.floor(m[1].replace(/\t/g, '  ').length / 2)), runs: inlineRuns(m[3]) });
    } else paragraph.push(line.trim());
  }
  flush();
  return { blocks, skippedImages };
}
