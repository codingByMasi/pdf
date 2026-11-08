// Finds a text by key (falls back to English) and fills in {name} style blanks.
export function translate(dict, fallback, key, vars = {}) {
  const raw = dict[key] ?? fallback[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}
