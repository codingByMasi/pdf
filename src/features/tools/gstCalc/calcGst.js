// GST sums: add GST to a price, or take GST out of a price that already has it. Rounds to paise.
export const RATES = [0, 5, 12, 18, 28];
const paise = (n) => Math.round(n * 100) / 100;

// mode: 'add' (amount has no GST) or 'remove' (amount includes GST).
export function calcGst(amount, rate, mode = 'add') {
  if (!(amount >= 0) || !(rate >= 0) || rate > 100 || !Number.isFinite(amount) || amount > 1e12) return { ok: false, errorKey: 'gst.bad' };
  const base = mode === 'remove' ? paise(amount / (1 + rate / 100)) : paise(amount);
  const total = mode === 'remove' ? paise(amount) : paise(amount * (1 + rate / 100));
  const gst = paise(total - base);
  const half = paise(gst / 2);
  return { ok: true, base, gst, cgst: half, sgst: paise(gst - half), total };
}
