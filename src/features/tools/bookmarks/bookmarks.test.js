// Tests reading the bookmark list and writing bookmarks into a real PDF.
import { describe, it, expect } from 'vitest';
import { PDFDocument, PDFName } from 'pdf-lib';
import { parseBookmarks, pageBookmarks } from './parseBookmarks.js';
import { addBookmarks } from './addBookmarks.js';

describe('parseBookmarks', () => {
  it('reads title and page per line', () => {
    expect(parseBookmarks('Intro | 1\nअध्याय | 3', 5).items).toEqual([{ title: 'Intro', page: 1 }, { title: 'अध्याय', page: 3 }]);
  });
  it('reports the bad line', () => {
    expect(parseBookmarks('Intro | 1\nbroken', 5)).toEqual({ errorKey: 'error.bookmarkBad', vars: { line: 2, count: 5 } });
    expect(parseBookmarks('A | 9', 5).errorKey).toBe('error.bookmarkBad');
    expect(parseBookmarks('  ', 5).errorKey).toBe('error.bookmarkEmpty');
  });
  it('makes one bookmark per page', () => {
    expect(pageBookmarks(2, 'Page')).toEqual([{ title: 'Page 1', page: 1 }, { title: 'Page 2', page: 2 }]);
  });
});

describe('addBookmarks', () => {
  it('writes an outline that points at the right pages', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]); doc.addPage([100, 100]);
    const out = await PDFDocument.load(await addBookmarks(await doc.save(), [{ title: 'One', page: 1 }, { title: 'Two', page: 2 }]));
    const root = out.context.lookup(out.catalog.get(PDFName.of('Outlines')));
    expect(root.get(PDFName.of('Count')).asNumber()).toBe(2);
    const last = out.context.lookup(root.get(PDFName.of('Last')));
    expect(last.lookup(PDFName.of('Dest')).get(0)).toBe(out.getPage(1).ref);
  });
});
