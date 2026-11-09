// Tests the name plate in English and Hindi, with a very long name that must shrink to fit.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { namePlatePdf } from './namePlatePdf.js';

describe('namePlatePdf', () => {
  it('makes one landscape page', async () => {
    for (const name of ['Asha', 'आशा वर्मा', 'A very long name that goes on and on and on for quite a while']) {
      const { bytes, replaced } = await namePlatePdf({ name, line: 'Teacher', accent: '#15803d' }, { loadBytes: loadTestFont });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
      expect(replaced).toBe(0);
    }
  });
});
