// Tests that each letter template makes a PDF in English and Hindi with no missing letters.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { TEMPLATES, letterParts, letterPdf } from './letterPdf.js';

const base = { name: 'Asha Verma', address: 'Jaipur', date: '15-03-2024', to: 'The Principal\nABC School', f1: '5B', f2: '16 March', f3: 'a family function' };

describe('letterPdf', () => {
  it.each(['en', 'hi'])('makes every template in %s', async (lang) => {
    for (const template of TEMPLATES) {
      const t = await tFor(lang);
      const { bytes, replaced } = await letterPdf({ ...base, template }, t, { loadBytes: loadTestFont });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
      expect(replaced, template).toBe(0);
      expect(letterParts({ ...base, template }, t).body, template).not.toMatch(/\{\w+\}/);
    }
  });
  it('fills blanks with dots when details are missing', async () => {
    expect(letterParts({ ...base, template: 'leaveOffice', f3: '' }, await tFor('en')).body).toContain('………');
  });
});
