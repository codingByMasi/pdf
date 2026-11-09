// Draws a formal letter PDF from a ready template (English or Hindi) and the person's details.
import { SOFT, buildDoc } from '../docKit/buildDoc.js';

export const TEMPLATES = ['leaveOffice', 'leaveSchool', 'resignation', 'complaint'];
const BLANK = '………';

// d: { template, name, address, date, to, f1, f2, f3 }. t: translate function for the letter's language.
export function letterParts(d, t) {
  const vars = { name: d.name || BLANK, f1: d.f1.trim() || BLANK, f2: d.f2.trim() || BLANK, f3: d.f3.trim() || BLANK };
  const key = (part) => `letter.${d.template}.${part}`;
  return {
    to: `${t('letter.to')}\n${d.to}`,
    subject: t(key('subject'), vars),
    body: t(key('body'), vars),
    closing: t(key('closing'), vars),
  };
}

export async function letterPdf(d, t, { loadBytes } = {}) {
  const p = letterParts(d, t);
  return buildDoc([d.name, d.address, d.to, d.f1, d.f2, d.f3, p.to, p.subject, p.body, p.closing], (c) => {
    c.write([d.name, d.address].filter(Boolean).join('\n'), { size: 11, align: 'right' });
    c.gap(4);
    if (d.date) c.write(`${t('letter.date')}: ${d.date}`, { size: 11, align: 'right', color: SOFT });
    c.gap(18);
    c.write(p.to, { size: 12 });
    c.gap(16);
    c.write(p.subject, { size: 12, face: 'bold' });
    c.gap(14);
    c.write(p.body, { size: 12, lineHeight: 1.6 });
    c.gap(16);
    c.write(p.closing, { size: 12, lineHeight: 1.6 });
  }, { margin: 64, loadBytes });
}
