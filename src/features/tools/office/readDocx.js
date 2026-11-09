// Reads the text of a Word (.docx) file into simple blocks: headings, paragraphs, lists and tables. Pictures and layout are left out.
import { attr, blocksOf, decodeXml, textsOf } from './xmlText.js';

const isOn = (xml, tag) => {
  const m = new RegExp(`<w:${tag}(?=[\\s/>])([^>]*)/?>`).exec(xml);
  return Boolean(m) && !/w:val="(0|false|none)"/.test(m[1]);
};

// numbering.xml -> Map of `${numId}|${level}` to 'bullet' or 'number'
export function readNumbering(xml) {
  const kinds = new Map();
  if (!xml) return kinds;
  const abstract = new Map();
  for (const block of blocksOf(xml, 'w:abstractNum')) {
    const id = attr(block.slice(0, block.indexOf('>') + 1), 'abstractNumId');
    for (const lvl of blocksOf(block, 'w:lvl')) {
      const fmt = /<w:numFmt[^>]*w:val="([^"]+)"/.exec(lvl)?.[1] ?? 'decimal';
      abstract.set(`${id}|${attr(lvl.slice(0, lvl.indexOf('>') + 1), 'ilvl')}`, fmt === 'bullet' ? 'bullet' : 'number');
    }
  }
  for (const num of blocksOf(xml, 'w:num')) {
    const numId = attr(num.slice(0, num.indexOf('>') + 1), 'numId');
    const abs = /<w:abstractNumId[^>]*w:val="([^"]+)"/.exec(num)?.[1];
    for (let level = 0; level < 9; level += 1) kinds.set(`${numId}|${level}`, abstract.get(`${abs}|${level}`) ?? 'bullet');
  }
  return kinds;
}

function runsOf(paragraph) {
  const runs = [];
  const cleaned = paragraph.replace(/<w:del(?=[\s>])[\s\S]*?<\/w:del>/g, '');
  for (const run of blocksOf(cleaned, 'w:r')) {
    const props = /<w:rPr>[\s\S]*?<\/w:rPr>/.exec(run)?.[0] ?? '';
    let text = '';
    const re = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>|<w:cr\/>/g;
    for (let m = re.exec(run); m; m = re.exec(run)) text += m[1] !== undefined ? decodeXml(m[1]) : m[0] === '<w:tab/>' ? '    ' : '\n';
    if (text) runs.push({ text, bold: isOn(props, 'b') });
  }
  return runs;
}

// Returns { blocks, tables }.
export function docxBlocks(xml, numberingXml = '') {
  const kinds = readNumbering(numberingXml);
  const counters = new Map();
  const blocks = [];
  const body = /<w:body>([\s\S]*)<\/w:body>/.exec(xml)?.[1] ?? xml;
  let tables = 0;
  const parts = [];
  const re = /<w:tbl>|<w:p(?=[\s>])/g;
  for (let m = re.exec(body); m; m = re.exec(body)) {
    if (m[0] === '<w:tbl>') {
      let depth = 1;
      let at = re.lastIndex;
      while (depth > 0) {
        const next = /<w:tbl>|<\/w:tbl>/g;
        next.lastIndex = at;
        const hit = next.exec(body);
        if (!hit) { at = body.length; break; }
        depth += hit[0] === '<w:tbl>' ? 1 : -1;
        at = next.lastIndex;
      }
      parts.push({ table: body.slice(m.index, at) });
      re.lastIndex = at;
    } else {
      const end = body.indexOf('</w:p>', m.index);
      if (end < 0) break;
      parts.push({ paragraph: body.slice(m.index, end + 6) });
      re.lastIndex = end + 6;
    }
  }
  for (const part of parts) {
    if (part.table) {
      const rows = blocksOf(part.table, 'w:tr').map((row) => blocksOf(row, 'w:tc').map((cell) => blocksOf(cell, 'w:p').map((p) => runsOf(p).map((r) => r.text).join('')).filter(Boolean).join(' ')));
      if (rows.length) { blocks.push({ kind: 'table', rows }); tables += 1; }
      continue;
    }
    const p = part.paragraph;
    const runs = runsOf(p);
    if (runs.length === 0) continue;
    const style = /<w:pStyle[^>]*w:val="([^"]+)"/.exec(p)?.[1] ?? '';
    const heading = /^heading\s*(\d)/i.exec(style) ?? (/^title$/i.test(style) ? [0, '1'] : /^subtitle$/i.test(style) ? [0, '2'] : null);
    const numId = /<w:numId[^>]*w:val="([^"]+)"/.exec(p)?.[1];
    if (heading) {
      blocks.push({ kind: 'heading', level: Math.min(6, Number(heading[1])), runs: runs.map((r) => ({ ...r, bold: true })) });
    } else if ((numId && numId !== '0') || /^list(bullet|number)/i.test(style.replace(/\s/g, ''))) {
      const level = Number(/<w:ilvl[^>]*w:val="(\d+)"/.exec(p)?.[1] ?? 0);
      let marker = '•';
      const numbered = numId ? kinds.get(`${numId}|${level}`) === 'number' : /^listnumber/i.test(style.replace(/\s/g, ''));
      if (numbered) {
        const key = `${numId ?? style}|${level}`;
        counters.set(key, (counters.get(key) ?? 0) + 1);
        for (let deeper = level + 1; deeper < 9; deeper += 1) counters.delete(`${numId}|${deeper}`);
        marker = `${counters.get(key)}.`;
      }
      blocks.push({ kind: 'item', marker, depth: Math.min(3, level), runs });
    } else blocks.push({ kind: 'para', runs });
  }
  return { blocks, tables };
}

export { textsOf };
