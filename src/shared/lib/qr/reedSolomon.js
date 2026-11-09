// Error-correction codewords for QR codes (Reed-Solomon over the 256-number field).
const EXP = new Array(512);
const LOG = new Array(256);
for (let i = 0, x = 1; i < 255; i += 1) {
  EXP[i] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}
for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function generator(count) {
  let poly = [1];
  for (let i = 0; i < count; i += 1) {
    const next = new Array(poly.length + 1).fill(0);
    poly.forEach((c, k) => {
      next[k] ^= c;
      next[k + 1] ^= mul(c, EXP[i]);
    });
    poly = next;
  }
  return poly;
}

// Returns the `count` error-correction codewords for a list of data codewords.
export function ecCodewords(data, count) {
  const gen = generator(count);
  const work = [...data, ...new Array(count).fill(0)];
  for (let i = 0; i < data.length; i += 1) {
    const lead = work[i];
    if (lead !== 0) for (let k = 0; k < gen.length; k += 1) work[i + k] ^= mul(gen[k], lead);
  }
  return work.slice(data.length);
}
