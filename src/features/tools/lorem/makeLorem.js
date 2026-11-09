// Makes sample "lorem ipsum" text (a nonsense Latin text used as a placeholder) in words, sentences or paragraphs.
const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum').split(' ');

export const UNITS = ['paragraphs', 'sentences', 'words'];

function words(count, rng, start) {
  const out = [];
  for (let i = 0; i < count; i += 1) out.push(start && i < 5 ? WORDS[i] : WORDS[Math.floor(rng() * WORDS.length)]);
  return out;
}
function sentence(rng, first) {
  const w = words(8 + Math.floor(rng() * 9), rng, first);
  const text = w.join(' ');
  return `${text[0].toUpperCase()}${text.slice(1)}.`;
}

export function makeLorem(unit, count, rng = Math.random) {
  const n = Math.max(1, Math.min(unit === 'words' ? 2000 : 100, Math.floor(count) || 1));
  if (unit === 'words') return words(n, rng, true).join(' ');
  if (unit === 'sentences') return Array.from({ length: n }, (_, i) => sentence(rng, i === 0)).join(' ');
  return Array.from({ length: n }, (_, p) => Array.from({ length: 3 + Math.floor(rng() * 4) }, (__, i) => sentence(rng, p === 0 && i === 0)).join(' ')).join('\n\n');
}
