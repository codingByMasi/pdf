// Draws an invoice PDF: seller and buyer, a table of items, totals with GST, the amount in words and notes.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';
import { rupeeWords } from '../numberWords/rupeeWords.js';
import { rupees } from '../calcKit/formatMoney.js';
import { computeInvoice } from './invoiceMath.js';

// data: { seller, sellerAddress, sellerTax, buyer, buyerAddress, buyerTax, number, date, items, gst, notes, accent }
export function invoiceTexts(data) {
  return [data.seller, data.sellerAddress, data.buyer, data.buyerAddress, data.notes, ...data.items.map((i) => i.desc), '₹'];
}

export async function invoicePdf(data, t, { loadBytes } = {}) {
  const sums = computeInvoice(data.items, data.gst);
  const accent = hexToRgb(data.accent);
  const wordsKey = t('lang.code') === 'hi' ? 'hi' : 'en';
  const words = rupeeWords(String(sums.total.toFixed(2)));
  return buildDoc([...invoiceTexts(data), t('invoice.title'), t('invoice.billTo'), t('invoice.inWords')], (c) => {
    c.write(t('invoice.title'), { size: 26, face: 'bold', color: accent });
    c.write([data.number && `${t('invoice.number')}: ${data.number}`, data.date && `${t('invoice.date')}: ${data.date}`].filter(Boolean).join('    '), { size: 10.5, color: SOFT, after: 14 });
    const half = c.contentWidth / 2 - 10;
    const left = [data.seller && data.seller, data.sellerAddress, data.sellerTax && `${t('invoice.taxId')}: ${data.sellerTax}`].filter(Boolean).join('\n');
    const right = [data.buyer, data.buyerAddress, data.buyerTax && `${t('invoice.taxId')}: ${data.buyerTax}`].filter(Boolean).join('\n');
    const top = c.y;
    const a = c.measure(`${t('invoice.from')}\n${left}`, { size: 10.5, width: half });
    const b = c.measure(`${t('invoice.billTo')}\n${right}`, { size: 10.5, width: half });
    c.textAt(t('invoice.from'), { x: c.margin, y: top, size: 9.5, face: 'bold', color: SOFT, width: half });
    c.textAt(left, { x: c.margin, y: top - 14, size: 10.5, width: half });
    c.textAt(t('invoice.billTo'), { x: c.margin + half + 20, y: top, size: 9.5, face: 'bold', color: SOFT, width: half });
    c.textAt(right, { x: c.margin + half + 20, y: top - 14, size: 10.5, width: half });
    c.y = top - Math.max(a.height, b.height) - 20;
    const rows = [[t('invoice.col.no'), t('invoice.col.desc'), t('invoice.col.qty'), t('invoice.col.rate'), t('invoice.col.amount')]];
    sums.lines.forEach((l, i) => rows.push([String(i + 1), l.desc, String(l.qty), rupees(l.rate), rupees(l.amount)]));
    c.table(rows, [{ width: 0.6 }, { width: 4 }, { width: 0.9, align: 'right' }, { width: 1.6, align: 'right' }, { width: 1.8, align: 'right' }], { headFill: [0.94, 0.95, 0.97] });
    c.gap(8);
    const tot = [['', t('invoice.subtotal'), rupees(sums.subtotal)]];
    if (sums.percent > 0) tot.push(['', `${t('invoice.tax')} ${sums.percent}%`, rupees(sums.gst)]);
    tot.push(['', t('invoice.total'), rupees(sums.total)]);
    c.table(tot, [{ width: 3 }, { width: 2 }, { width: 2, align: 'right' }], { header: false });
    if (words.ok) {
      c.gap(10);
      c.write(`${t('invoice.inWords')}: ${wordsKey === 'hi' ? words.hi : words.en}`, { size: 10, color: INK });
    }
    if (data.notes) {
      c.gap(14);
      c.write(t('invoice.notes'), { size: 10, face: 'bold', color: SOFT });
      c.write(data.notes, { size: 10 });
    }
  }, { loadBytes });
}
