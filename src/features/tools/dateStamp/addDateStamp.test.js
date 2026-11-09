// Tests the date stamp on one page, all pages, and Hindi text.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { addDateStamp } from './addDateStamp.js';
import { loadTestFont } from '../../../shared/lib/testFonts.js';

async function blank(pages) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i += 1) doc.addPage([300, 300]);
  return doc.save();
}

describe('addDateStamp', () => {
  it('stamps every page, or only the first', async () => {
    const all = await addDateStamp(await blank(3), { name: 'Ravi', date: '9 Nov 2026' }, { loadBytes: loadTestFont });
    const first = await addDateStamp(await blank(3), { name: 'Ravi', pages: 'first' }, { loadBytes: loadTestFont });
    expect((await PDFDocument.load(all.bytes)).getPageCount()).toBe(3);
    expect(all.bytes.length).toBeGreaterThan(first.bytes.length - 1);
    expect(all.replaced).toBe(0);
  });
  it('writes Hindi without replacing letters', async () => {
    const out = await addDateStamp(await blank(1), { name: 'रवि कुमार', date: '9 नवंबर 2026' }, { loadBytes: loadTestFont });
    expect(out.replaced).toBe(0);
  });
  it('refuses an empty stamp', async () => {
    await expect(addDateStamp(await blank(1), {}, { loadBytes: loadTestFont })).rejects.toMatchObject({ errorKey: 'error.stampEmpty' });
  });
});
