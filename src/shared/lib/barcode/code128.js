// Code 128 (set B: letters, digits and symbols) and EAN-13 barcodes. Returns a list of bar and space widths, starting with a bar.
const PATTERNS = '212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'.split(' ');
const START_B = 104;
const STOP = 106;

const widths = (value) => [...PATTERNS[value]].map(Number);

export function code128(text) {
  if (!text || ![...text].every((ch) => ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) <= 126)) {
    throw Object.assign(new Error('bad text'), { errorKey: 'barcode.badText' });
  }
  const values = [...text].map((ch) => ch.charCodeAt(0) - 32);
  const sum = values.reduce((total, v, i) => total + v * (i + 1), START_B);
  return [START_B, ...values, sum % 103, STOP].flatMap(widths);
}

// EAN-13: twelve digits get a check digit added; thirteen digits must have the right one.
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const FIRST = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

export const eanCheckDigit = (twelve) => (10 - (([...twelve].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0)) % 10)) % 10;

export function ean13(digits) {
  if (!/^\d{12,13}$/.test(digits)) throw Object.assign(new Error('bad digits'), { errorKey: 'barcode.badEan' });
  const code = digits.length === 12 ? digits + eanCheckDigit(digits) : digits;
  if (Number(code[12]) !== eanCheckDigit(code.slice(0, 12))) throw Object.assign(new Error('bad check'), { errorKey: 'barcode.badCheck' });
  const parity = FIRST[Number(code[0])];
  let bits = '101';
  for (let i = 1; i <= 6; i += 1) bits += (parity[i - 1] === 'L' ? L : G)[Number(code[i])];
  bits += '01010';
  for (let i = 7; i <= 12; i += 1) bits += R[Number(code[i])];
  bits += '101';
  // Turn the 0/1 string into runs, starting with a bar (the code starts with 1).
  return { code, runs: [...bits.matchAll(/(1+|0+)/g)].map((m) => m[0].length) };
}
