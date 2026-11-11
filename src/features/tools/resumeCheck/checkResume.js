// Simple resume checks (no AI): length, pages, contact details, sections, fonts and numbers. Returns [{ id, ok }].
const SECTIONS = { education: /education|qualification|शिक्षा/i, experience: /experience|employment|internship|work history|अनुभव/i, skills: /skills|कौशल|कौशल/i };

// input: { text, pages, fonts: number of different font families }.
export function checkResume({ text, pages, fonts }) {
  const words = (text.match(/\S+/g) ?? []).length;
  const lines = text.split(/\n/).filter((l) => l.trim());
  const checks = [
    { id: 'readable', ok: words >= 30 },
    { id: 'pages', ok: pages <= 2 },
    { id: 'words', ok: words >= 150 && words <= 900 },
    { id: 'email', ok: /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text) },
    { id: 'phone', ok: /(\+?\d[\d\s-]{8,}\d)/.test(text) },
    { id: 'education', ok: SECTIONS.education.test(text) },
    { id: 'experience', ok: SECTIONS.experience.test(text) },
    { id: 'skills', ok: SECTIONS.skills.test(text) },
    { id: 'numbers', ok: (text.match(/\d+\s?%|\d{2,}/g) ?? []).length >= 3 },
    { id: 'bullets', ok: lines.some((l) => /^\s*[•\-–*▪●]/.test(l)) },
    { id: 'fonts', ok: fonts <= 3 },
  ];
  return { words, pages, fonts, checks: words < 30 ? checks.filter((c) => c.id === 'readable' || c.id === 'pages' || c.id === 'fonts') : checks };
}

// Different font families in a PDF's text, found from the font names (subset tags like ABCDEF+ are removed).
export function countFontFamilies(names) {
  const family = (n) => n.replace(/^[A-Z]{6}\+/, '').replace(/[-,](Bold|Italic|Oblique|Regular|BoldItalic|Light|Medium|Semibold)+.*$/i, '').replace(/(Bold|Italic)+$/i, '');
  return new Set(names.map(family)).size;
}
