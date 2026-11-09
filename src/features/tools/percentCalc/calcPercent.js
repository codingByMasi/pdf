// Percentage sums in four ways. Each returns { ok, value } or { ok: false }.
export const MODES = ['of', 'whatPercent', 'change', 'plusMinus'];
const num = (v) => (v === '' || v === null ? NaN : Number(v));

// of: a% of b. whatPercent: a is what % of b. change: from a to b. plusMinus: b increased (or cut) by a%.
export function calcPercent(mode, a, b) {
  const x = num(a);
  const y = num(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { ok: false };
  if (mode === 'of') return { ok: true, value: (x / 100) * y };
  if (mode === 'whatPercent') return y === 0 ? { ok: false, errorKey: 'pct.zero' } : { ok: true, value: (x / y) * 100 };
  if (mode === 'change') return x === 0 ? { ok: false, errorKey: 'pct.zero' } : { ok: true, value: ((y - x) / Math.abs(x)) * 100, from: x, to: y };
  if (mode === 'plusMinus') return { ok: true, value: y * (1 + x / 100), minus: y * (1 - x / 100) };
  return { ok: false };
}

export const tidy = (n) => Number(n.toFixed(6)).toString();
