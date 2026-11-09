// Checks, tidies and shrinks JSON text. Returns { ok, text } or { ok: false, line, column }.
function where(text, error) {
  const match = /position (\d+)/.exec(error.message) ?? /line (\d+) column (\d+)/.exec(error.message);
  if (!match) {
    const lines = text.split('\n');
    return /end of|unterminated/i.test(error.message) ? { line: lines.length, column: lines[lines.length - 1].length + 1 } : { line: 1, column: 1 };
  }
  if (match.length === 3) return { line: Number(match[1]), column: Number(match[2]) };
  const before = text.slice(0, Number(match[1]));
  const lines = before.split('\n');
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

// indent: number of spaces, or 'tab', or 0 to make it one line.
export function formatJson(text, indent = 2) {
  try {
    const value = JSON.parse(text);
    return { ok: true, text: JSON.stringify(value, null, indent === 'tab' ? '\t' : indent) };
  } catch (error) {
    return { ok: false, ...where(text, error) };
  }
}

// Sorts object keys everywhere, so two files can be compared.
export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]));
  return value;
}
export function formatSorted(text, indent = 2) {
  try {
    return { ok: true, text: JSON.stringify(sortKeys(JSON.parse(text)), null, indent === 'tab' ? '\t' : indent) };
  } catch (error) {
    return { ok: false, ...where(text, error) };
  }
}
