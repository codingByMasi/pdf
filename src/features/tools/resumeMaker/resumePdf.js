// Draws a plain one-column resume PDF: contact line, summary, experience, education, skills and extras.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';

const lines = (text) => String(text ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
const filled = (list, keys) => list.filter((item) => keys.some((k) => String(item[k] ?? '').trim()));

// data: { name, title, phone, email, address, summary, experience: [{role, company, period, details}], education: [{degree, school, period}], skills, extras, accent }
export function resumeTexts(d) {
  return [d.name, d.title, d.address, d.summary, d.skills, d.extras, ...d.experience.flatMap((e) => [e.role, e.company, e.details]), ...d.education.flatMap((e) => [e.degree, e.school])];
}

export async function resumePdf(d, t, { loadBytes } = {}) {
  const accent = hexToRgb(d.accent);
  const jobs = filled(d.experience, ['role', 'company', 'details']);
  const schools = filled(d.education, ['degree', 'school']);
  return buildDoc([...resumeTexts(d), t('resume.summary'), t('resume.experience')], (c) => {
    const section = (title) => {
      c.gap(10);
      c.write(title, { size: 12, face: 'bold', color: accent });
      c.rule({ color: accent, thickness: 1 });
      c.gap(4);
    };
    c.write(d.name || ' ', { size: 24, face: 'bold' });
    if (d.title) c.write(d.title, { size: 13, color: SOFT });
    c.write([d.phone, d.email, d.address].filter(Boolean).join('  •  '), { size: 10, color: SOFT });
    if (d.summary.trim()) { section(t('resume.summary')); c.write(d.summary, { size: 10.5 }); }
    if (jobs.length) {
      section(t('resume.experience'));
      jobs.forEach((j) => {
        c.write([j.role, j.company].filter(Boolean).join(' — '), { size: 11, face: 'bold' });
        if (j.period) c.write(j.period, { size: 9.5, color: SOFT });
        lines(j.details).forEach((line) => c.write(`•  ${line.replace(/^[-•*]\s*/, '')}`, { size: 10.5, x: c.margin + 6, width: c.contentWidth - 6 }));
        c.gap(6);
      });
    }
    if (schools.length) {
      section(t('resume.education'));
      schools.forEach((s) => {
        c.write([s.degree, s.school].filter(Boolean).join(' — '), { size: 11, face: 'bold' });
        if (s.period) c.write(s.period, { size: 9.5, color: SOFT });
        c.gap(4);
      });
    }
    if (d.skills.trim()) { section(t('resume.skills')); c.write(lines(d.skills.replace(/,/g, '\n')).join('  •  '), { size: 10.5 }); }
    if (d.extras.trim()) { section(t('resume.extras')); c.write(d.extras, { size: 10.5, color: INK }); }
  }, { margin: 50, loadBytes });
}
