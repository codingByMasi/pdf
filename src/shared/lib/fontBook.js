// Puts the Latin and Hindi fonts into a PDF and measures text with them.
import { loadFontBytes } from './fontFiles.js';
import { splitByScript } from './textScript.js';

// Options: deva (load the Hindi font), bold (load the bold fonts), loadBytes (replaceable in tests).
export async function createFontBook(doc, { deva = false, bold = false, loadBytes = loadFontBytes } = {}) {
  await import('regenerator-runtime/runtime.js');
  doc.registerFontkit((await import('@pdf-lib/fontkit')).default);

  const fonts = new Map();
  const sets = new Map();
  const widths = new Map();
  const book = { replaced: 0 };

  async function add(face, script) {
    const font = await doc.embedFont(await loadBytes(face, script), { subset: true });
    fonts.set(`${face}|${script}`, font);
    sets.set(`${face}|${script}`, new Set(font.getCharacterSet()));
  }
  await add('regular', 'latin');
  if (deva) await add('regular', 'deva');
  if (bold) {
    await add('bold', 'latin');
    if (deva) await add('bold', 'deva');
  }

  const pick = (face, script) => (fonts.has(`${face}|${script}`) ? face : 'regular');
  book.font = (face, script) => fonts.get(`${pick(face, script)}|${script}`);

  book.width = (face, script, text, size) => {
    const key = `${pick(face, script)}|${script}|${text}`;
    let unit = widths.get(key);
    if (unit === undefined) {
      unit = book.font(face, script).widthOfTextAtSize(text, 1);
      if (widths.size > 50000) widths.clear();
      widths.set(key, unit);
    }
    return unit * size;
  };

  // Removes things a PDF cannot show and swaps letters the fonts lack for "?". Counts the swaps in book.replaced.
  book.clean = (text) => {
    const latin = sets.get('regular|latin');
    const hindi = sets.get('regular|deva');
    let out = '';
    for (const run of splitByScript(text.normalize('NFC').replace(/\r\n?/g, '\n').replace(/\t/g, '    '))) {
      const set = run.script === 'deva' ? hindi : latin;
      for (const char of run.text) {
        const code = char.codePointAt(0);
        if (char === '\n') out += char;
        else if (code < 32 || code === 0x7f || code === 0xad || code === 0xfeff || code === 0x200b) continue;
        else if (set?.has(code)) out += char;
        else if (run.script === 'deva' && (code === 0x200c || code === 0x200d)) continue;
        else {
          out += '?';
          book.replaced += 1;
        }
      }
    }
    return out;
  };

  return book;
}
