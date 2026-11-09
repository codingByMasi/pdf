// Tests reading and writing PDF file info, including Hindi text.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { readInfo, writeInfo } from './pdfInfo.js';

async function plain() {
  const doc = await PDFDocument.create();
  doc.addPage([100, 100]);
  return doc.save();
}

describe('pdfInfo', () => {
  it('writes and reads fields back, including Hindi', async () => {
    const out = await writeInfo(await plain(), { title: 'रिपोर्ट', author: 'Asha', keywords: 'a, b' });
    const info = await readInfo(out);
    expect(info.title).toBe('रिपोर्ट');
    expect(info.author).toBe('Asha');
    expect(info.keywords).toBe('a, b');
  });
  it('removes empty fields and everything with clearAll', async () => {
    const first = await writeInfo(await plain(), { title: 'X', author: 'Y' });
    expect((await readInfo(await writeInfo(first, { title: 'X', author: '' }))).author).toBe('');
    const cleared = await readInfo(await writeInfo(first, { title: 'X' }, { clearAll: true }));
    expect(cleared.title).toBe('');
  });
});
