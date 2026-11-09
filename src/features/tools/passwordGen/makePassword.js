// Makes random passwords with the browser's secure random numbers. Nothing is stored or sent.
const SETS = { lower: 'abcdefghijkmnopqrstuvwxyz', upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ', digits: '23456789', symbols: '!@#$%^&*()-_=+?' };
const LOOKALIKES = { lower: 'l', upper: 'IO', digits: '01' };

// Secure random whole number below `limit` (no bias).
export function secureInt(limit, random = (a) => crypto.getRandomValues(a)) {
  const max = Math.floor(0x100000000 / limit) * limit;
  const box = new Uint32Array(1);
  do random(box); while (box[0] >= max);
  return box[0] % limit;
}

// options: { length 4-128, lower, upper, digits, symbols, easy (leave out look-alikes like 0 and O) }
export function makePassword({ length = 16, lower = true, upper = true, digits = true, symbols = false, easy = true } = {}, random) {
  const chosen = Object.entries({ lower, upper, digits, symbols }).filter(([, on]) => on).map(([k]) => k);
  if (chosen.length === 0) return '';
  const n = Math.max(4, Math.min(128, Math.floor(length) || 16));
  const sets = chosen.map((k) => {
    const all = SETS[k] + (easy ? '' : (LOOKALIKES[k] ?? ''));
    return all;
  });
  const pool = sets.join('');
  const chars = sets.map((set) => set[secureInt(set.length, random)]);
  while (chars.length < n) chars.push(pool[secureInt(pool.length, random)]);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = secureInt(i + 1, random);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, n).join('');
}

// Rough strength in bits of guessing: length x log2(pool size).
export function strengthBits(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 20;
  return Math.round(password.length * Math.log2(Math.max(pool, 1)));
}
