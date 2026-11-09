// Tests that a visiting card sheet and a single card are made.
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { cardPdf } from './cardPdf.js';

const d = { name: 'आशा वर्मा', title: 'Designer', company: 'Asha Studio', phone: '98765 43210', email: 'a@example.com', website: 'example.com', address: 'Jaipur', accent: '#1d4ed8', sheet: 'sheet' };

describe('cardPdf', () => {
  it('makes a sheet and a single card', async () => {
    for (const sheet of ['sheet', 'one']) {
      const { bytes, replaced } = await cardPdf({ ...d, sheet }, { loadBytes: loadTestFont });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
      expect(replaced).toBe(0);
    }
  });
});
