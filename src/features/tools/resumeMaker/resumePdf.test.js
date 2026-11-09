// Tests that a resume PDF is made in English and Hindi, and grows to more pages when long.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { resumePdf } from './resumePdf.js';

const base = { name: 'Asha Verma', title: 'Teacher', phone: '98765 43210', email: 'asha@example.com', address: 'Jaipur', summary: 'Careful and kind.', experience: [{ role: 'Teacher', company: 'ABC School', period: '2018–2024', details: 'Taught maths\nRan the science club' }], education: [{ degree: 'B.Ed', school: 'XYZ College', period: '2017' }], skills: 'Maths, Hindi, English', extras: '', accent: '#15803d' };

describe('resumePdf', () => {
  it('makes one page', async () => {
    const { bytes, replaced } = await resumePdf(base, await tFor('en'), { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect(replaced).toBe(0);
  });
  it('handles Hindi text', async () => {
    const hi = { ...base, name: 'आशा वर्मा', summary: 'मेहनती और ईमानदार।' };
    expect((await resumePdf(hi, await tFor('hi'), { loadBytes: loadTestFont })).replaced).toBe(0);
  });
  it('makes more pages for long resumes', async () => {
    const long = { ...base, experience: Array.from({ length: 12 }, (_, i) => ({ role: `Job ${i}`, company: 'Co', period: '', details: 'a\nb\nc\nd\ne' })) };
    expect((await PDFDocument.load((await resumePdf(long, await tFor('en'), { loadBytes: loadTestFont })).bytes)).getPageCount()).toBeGreaterThan(1);
  });
});
