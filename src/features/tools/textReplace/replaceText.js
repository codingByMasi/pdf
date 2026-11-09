// Finds and replaces inside text. Returns { ok, text, count } or { ok: false } for a broken pattern.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function replaceText(text, { find, replace = '', matchCase = false, wholeWord = false, regex = false }) {
  if (!find) return { ok: true, text, count: 0 };
  let source = regex ? find : escape(find);
  if (wholeWord) source = `(?<![\\p{L}\\p{N}_])(?:${source})(?![\\p{L}\\p{N}_])`;
  let pattern;
  try {
    pattern = new RegExp(source, `g${matchCase ? '' : 'i'}u`);
  } catch {
    return { ok: false };
  }
  let count = 0;
  const out = text.replace(pattern, (...args) => {
    count += 1;
    return regex ? args[0].replace(new RegExp(pattern.source, pattern.flags.replace('g', '')), replace) : replace;
  });
  return { ok: true, text: out, count };
}
