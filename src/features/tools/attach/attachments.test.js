// Tests for attaching files to a PDF and getting them back.
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { attachFiles } from './attachFiles.js';
import { extractAttachments } from './extractAttachments.js';

async function blank() {
  const doc = await PDFDocument.create();
  doc.addPage();
  return doc.save();
}
const bytes = (text) => new TextEncoder().encode(text);

describe('attachments', () => {
  it('attaches files and extracts them again, unchanged', async () => {
    const out = await attachFiles(await blank(), [{ name: 'note.txt', bytes: bytes('hello'), type: 'text/plain' }, { name: 'data.csv', bytes: bytes('a,b\n1,2'), type: 'text/csv' }]);
    const files = await extractAttachments(out);
    expect(files.map((f) => f.name)).toEqual(['note.txt', 'data.csv']);
    expect(new TextDecoder().decode(files[0].data)).toBe('hello');
  });
  it('gives nothing for a PDF without attachments', async () => {
    expect(await extractAttachments(await blank())).toEqual([]);
  });
  it('makes repeated names unique', async () => {
    const out = await attachFiles(await blank(), [{ name: 'a.txt', bytes: bytes('1') }, { name: 'a.txt', bytes: bytes('2') }]);
    const names = (await extractAttachments(out)).map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
