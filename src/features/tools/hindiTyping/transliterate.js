// Turns English-letter typing into Hindi (Devanagari): "namaste" becomes "नमस्ते". Text in {curly braces} stays as typed.
const CONSONANTS = {
  chh: 'छ', ksh: 'क्ष', gy: 'ज्ञ', Rh: 'ढ़', Th: 'ठ', Dh: 'ढ', kh: 'ख', gh: 'घ', ch: 'च', jh: 'झ', th: 'थ', dh: 'ध', ph: 'फ', bh: 'भ', sh: 'श',
  K: 'क', G: 'ग', P: 'प', B: 'ब', k: 'क', g: 'ग', c: 'क', j: 'ज', T: 'ट', D: 'ड', N: 'ण', R: 'ड़', t: 'त', d: 'द', n: 'न', p: 'प', b: 'ब', m: 'म', y: 'य', r: 'र', l: 'ल', L: 'ळ',
  v: 'व', w: 'व', s: 'स', S: 'ष', h: 'ह', f: 'फ़', z: 'ज़', q: 'क़', x: 'क्स',
};
const VOWELS = { aa: ['आ', 'ा'], ai: ['ऐ', 'ै'], au: ['औ', 'ौ'], ii: ['ई', 'ी'], ee: ['ई', 'ी'], uu: ['ऊ', 'ू'], oo: ['ऊ', 'ू'], a: ['अ', ''], i: ['इ', 'ि'], u: ['उ', 'ु'], e: ['ए', 'े'], o: ['ओ', 'ो'], A: ['आ', 'ा'], I: ['ई', 'ी'], U: ['ऊ', 'ू'] };
const SIGNS = { M: 'ं', H: 'ः', '~': 'ँ' };
const HALANT = '्';
const CONS_KEYS = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const VOWEL_KEYS = Object.keys(VOWELS).sort((a, b) => b.length - a.length);
const DIGITS = '०१२३४५६७८९';

function word(text) {
  let out = '';
  let afterConsonant = false;
  for (let i = 0; i < text.length;) {
    const rest = text.slice(i);
    const cons = CONS_KEYS.find((k) => rest.startsWith(k));
    if (cons) {
      if (afterConsonant) out += HALANT;
      out += CONSONANTS[cons];
      afterConsonant = true;
      i += cons.length;
      continue;
    }
    const vowel = VOWEL_KEYS.find((k) => rest.startsWith(k));
    if (vowel) {
      out += afterConsonant ? VOWELS[vowel][1] : VOWELS[vowel][0];
      afterConsonant = false;
      i += vowel.length;
      continue;
    }
    if (SIGNS[rest[0]]) {
      out += SIGNS[rest[0]];
      afterConsonant = false;
    } else out += rest[0];
    i += 1;
  }
  return out;
}

// options: { danda: turn a full stop into "।", digits: use Hindi digits }
export function transliterate(text, { danda = true, digits = false } = {}) {
  return text
    .split(/(\{[^}]*\})/)
    .map((part) => {
      if (part.startsWith('{') && part.endsWith('}')) return part.slice(1, -1);
      let out = part.replace(/[A-Za-z~]+/g, word);
      if (danda) out = out.replace(/\.(?=\s|$)/g, '।');
      if (digits) out = out.replace(/[0-9]/g, (d) => DIGITS[Number(d)]);
      return out;
    })
    .join('');
}

export const EXAMPLES = [['namaste', 'नमस्ते'], ['dhanyavaad', 'धन्यवाद'], ['kaise ho', 'कैसे हो'], ['bhaarat', 'भारत'], ['meraa naam aashaa hai', 'मेरा नाम आशा है']];
