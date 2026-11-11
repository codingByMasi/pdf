// Multiplies an amount by a rate you typed. Returns text for the answer and for the rate the other way round.
export function convertAmount(amount, rate) {
  const a = Number(amount);
  const r = Number(rate);
  if (!Number.isFinite(a) || !(r > 0) || Math.abs(a) > 1e15) return { ok: false };
  const value = a * r;
  return { ok: true, value, text: value.toLocaleString('en-IN', { maximumFractionDigits: 4 }), back: String(+(1 / r).toPrecision(6)) };
}
