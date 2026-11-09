// Small jobs on lines of text. Each takes the whole text and returns the new text.
export const OPS = ['dedupe', 'sortAz', 'sortZa', 'reverse', 'trim', 'noBlank', 'number', 'shuffle'];

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function runLineOp(op, text, rng = Math.random) {
  const lines = text.split('\n');
  switch (op) {
    case 'dedupe': return [...new Set(lines)].join('\n');
    case 'sortAz': return lines.slice().sort(collator.compare).join('\n');
    case 'sortZa': return lines.slice().sort((a, b) => collator.compare(b, a)).join('\n');
    case 'reverse': return lines.slice().reverse().join('\n');
    case 'trim': return lines.map((l) => l.trim()).join('\n');
    case 'noBlank': return lines.filter((l) => l.trim() !== '').join('\n');
    case 'number': return lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    case 'shuffle': {
      const a = lines.slice();
      for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a.join('\n');
    }
    default: return text;
  }
}
