// Tests the resume rules.
import { describe, it, expect } from 'vitest';
import { checkResume, countFontFamilies } from './checkResume.js';

const good = `Ravi Kumar ravi@example.com +91 98765 43210
Education
B.Com 2022 with 78% marks
Experience
• Handled 120 customer calls a day and raised sales by 15%
• Trained 4 new staff in 2023
Skills
Excel, Tally, communication. ${'word '.repeat(150)}`;

describe('checkResume', () => {
  it('passes a good resume', () => {
    const r = checkResume({ text: good, pages: 1, fonts: 2 });
    expect(r.checks.every((c) => c.ok)).toBe(true);
  });
  it('flags too many pages, fonts, and no contact', () => {
    const r = checkResume({ text: 'Skills ' + 'word '.repeat(200), pages: 4, fonts: 6 });
    const bad = r.checks.filter((c) => !c.ok).map((c) => c.id);
    expect(bad).toEqual(expect.arrayContaining(['pages', 'fonts', 'email', 'phone']));
  });
  it('says a scan cannot be read', () => {
    const r = checkResume({ text: '', pages: 1, fonts: 0 });
    expect(r.checks.find((c) => c.id === 'readable').ok).toBe(false);
    expect(r.checks).toHaveLength(3);
  });
  it('counts font families', () => {
    expect(countFontFamilies(['ABCDEF+Arial', 'GHIJKL+Arial-Bold', 'Calibri'])).toBe(2);
  });
});
