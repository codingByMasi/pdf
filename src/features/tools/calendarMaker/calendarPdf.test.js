// Tests that year and month calendars are made in English and Hindi.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { calendarPdf } from './calendarPdf.js';

describe('calendarPdf', () => {
  it.each(['en', 'hi'])('makes a year and a month in %s', async (lang) => {
    for (const mode of ['year', 'month']) {
      const { bytes, replaced } = await calendarPdf({ mode, year: '2025', month: '2', startDay: 1, accent: '#1d4ed8' }, tFor(lang), { loadBytes: loadTestFont });
      const doc = await PDFDocument.load(bytes);
      expect(doc.getPageCount()).toBe(1);
      expect(replaced).toBe(0);
      const page = doc.getPage(0);
      expect(page.getWidth() > page.getHeight()).toBe(mode === 'month');
    }
  });
});
