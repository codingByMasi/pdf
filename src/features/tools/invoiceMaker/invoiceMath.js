// Invoice sums: each line, the subtotal, GST split into CGST and SGST, and the total. Rounds to paise.
const paise = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// items: [{ desc, qty, rate }] as text or numbers. gstRate: percent (0 for none).
export function computeInvoice(items, gstRate = 0) {
  const lines = items
    .map((i) => {
      const qty = Number(i.qty) || 0;
      const rate = Number(i.rate) || 0;
      return { desc: String(i.desc ?? '').trim(), qty, rate, amount: paise(qty * rate) };
    })
    .filter((l) => l.desc || l.amount);
  const subtotal = paise(lines.reduce((a, l) => a + l.amount, 0));
  const percent = Math.max(0, Math.min(100, Number(gstRate) || 0));
  const gst = paise((subtotal * percent) / 100);
  const cgst = paise(gst / 2);
  return { lines, subtotal, percent, gst, cgst, sgst: paise(gst - cgst), total: paise(subtotal + gst) };
}
