// Changes the letter case of text: UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case.
export const CASES = ['upper', 'lower', 'title', 'sentence', 'camel', 'snake', 'kebab'];

const wordsOf = (text) => text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean);

export function convertCase(kind, text) {
  switch (kind) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.toLowerCase().replace(/(^|[\s"'(\-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    case 'sentence': return text.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    case 'camel': return wordsOf(text).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join('');
    case 'snake': return wordsOf(text).map((w) => w.toLowerCase()).join('_');
    case 'kebab': return wordsOf(text).map((w) => w.toLowerCase()).join('-');
    default: return text;
  }
}
