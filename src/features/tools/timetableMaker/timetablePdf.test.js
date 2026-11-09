// Tests that a timetable page is made with Hindi notes.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { timetablePdf } from './timetablePdf.js';

describe('timetablePdf', () => {
  it.each(['en', 'hi'])('makes one landscape page in %s', async (lang) => {
    const cells = Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (__, p) => (p % 2 ? 'गणित' : `Maths ${r}`)));
    const { bytes, replaced } = await timetablePdf({ title: 'कक्षा 5', days: 6, periods: 8, cells, times: ['9:00', '9:45'], accent: '#1d4ed8' }, tFor(lang), { loadBytes: loadTestFont });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect(replaced).toBe(0);
  });
});
