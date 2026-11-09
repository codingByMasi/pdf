// Tests that every certificate kind makes a landscape page in English and Hindi.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { tFor } from '../docKit/tFor.js';
import { KINDS, certificatePdf } from './certificatePdf.js';

const d = { kind: 'appreciation', title: '', name: 'Ravi Kumar', reason: 'helping at the school fair', org: 'ABC School', date: '15-03-2024', signer: 'A. Sharma', signerTitle: 'Principal', accent: '#b45309' };

describe('certificatePdf', () => {
  it.each(['en', 'hi'])('makes all kinds in %s', async (lang) => {
    for (const kind of KINDS) {
      const { bytes, replaced } = await certificatePdf({ ...d, kind, name: lang === 'hi' ? 'रवि कुमार' : d.name }, tFor(lang), { loadBytes: loadTestFont });
      const page = (await PDFDocument.load(bytes)).getPage(0);
      expect(page.getWidth()).toBeGreaterThan(page.getHeight());
      expect(replaced, kind).toBe(0);
    }
  });
});
