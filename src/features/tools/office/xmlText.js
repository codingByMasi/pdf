// Tiny helpers to pull text out of the XML inside Word, Excel and PowerPoint files (no full XML parser needed for plain text).
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

export function decodeXml(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (all, code) => {
    if (code[0] === '#') {
      const number = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(number) && number > 0 && number < 0x110000 ? String.fromCodePoint(number) : '';
    }
    return NAMED[code.toLowerCase()] ?? all;
  });
}

export const utf8 = (bytes) => new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '');

// All values of one attribute, or the first match.
export function attr(tag, name) {
  const match = new RegExp(`\\s(?:[\\w-]+:)?${name}="([^"]*)"`).exec(tag);
  return match ? decodeXml(match[1]) : null;
}

// Every <prefix:name ...>...</prefix:name> block, as strings (does not handle the same tag nested in itself).
export function blocksOf(xml, name) {
  const found = [];
  const open = new RegExp(`<${name}(?=[\\s>/])[^>]*?(/?)>`, 'g');
  for (let m = open.exec(xml); m; m = open.exec(xml)) {
    if (m[1] === '/') {
      found.push(m[0]);
      continue;
    }
    const close = xml.indexOf(`</${name}>`, open.lastIndex);
    if (close < 0) break;
    found.push(xml.slice(m.index, close + name.length + 3));
    open.lastIndex = close + name.length + 3;
  }
  return found;
}

// Joined text of all <tag>text</tag> in a piece of XML.
export function textsOf(xml, tag) {
  const out = [];
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g');
  for (let m = re.exec(xml); m; m = re.exec(xml)) out.push(decodeXml(m[1]));
  return out.join('');
}
