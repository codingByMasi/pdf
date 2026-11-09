// Turns an amount like "1234.50" into words for rupees and paise, in English or Hindi.
import { wordsEn } from './wordsEn.js';
import { wordsHi } from './wordsHi.js';

export const MAX_RUPEES = 9999999999999;

// Returns { ok, en, hi } or { ok: false, errorKey }.
export function rupeeWords(text) {
  const clean = String(text).replace(/[,\s₹]/g, '');
  if (!/^\d+(\.\d{0,2})?$/.test(clean)) return { ok: false, errorKey: 'words.bad' };
  const [whole, fraction = ''] = clean.split('.');
  if (whole.length > 13) return { ok: false, errorKey: 'words.big' };
  const rupees = Number(whole);
  const paise = Number(fraction.padEnd(2, '0'));
  if (rupees > MAX_RUPEES) return { ok: false, errorKey: 'words.big' };
  const en = [rupees || !paise ? `Rupees ${wordsEn(rupees)}` : '', paise ? `${rupees ? 'and ' : ''}${wordsEn(paise)} Paise` : ''].filter(Boolean).join(' ') + ' Only';
  const hi = [rupees || !paise ? `${wordsHi(rupees)} रुपये` : '', paise ? `${rupees ? 'और ' : ''}${wordsHi(paise)} पैसे` : ''].filter(Boolean).join(' ') + ' मात्र';
  return { ok: true, en, hi };
}
