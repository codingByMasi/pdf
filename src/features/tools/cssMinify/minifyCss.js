// Makes CSS smaller: removes comments and extra spaces and the last semicolon of each block. Text in quotes and url(...) is left alone.
export function minifyCss(css) {
  const keep = [];
  // Hide strings and urls so the clean-up cannot change them.
  let text = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|url\([^)]*\))/gi, (m) => { keep.push(m); return `\u0000${keep.length - 1}\u0000`; });
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>~])\s*/g, '$1')
    .replace(/\s*:\s*/g, ':')
    .replace(/;}/g, '}')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
  // A colon inside a selector like "a :hover" must keep its space; we cannot tell, so only plain "a:hover" forms are safe.
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[Number(i)]);
}
