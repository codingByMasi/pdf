// Tests that loadPdf reports damaged and empty files with a friendly key.
import { describe, it, expect } from 'vitest';
import { loadPdf } from './pdfLoad.js';

const bytes = (text) => new TextEncoder().encode(text);

describe('loadPdf', () => {
  it('reports plain text as a damaged file', async () => {
    await expect(loadPdf(bytes('hello'))).rejects.toMatchObject({ errorKey: 'error.corrupt' });
  });
  it('reports a half-made PDF as a damaged file', async () => {
    await expect(loadPdf(bytes('%PDF-1.4\nthis is not really a pdf'))).rejects.toMatchObject({ errorKey: 'error.corrupt' });
  });
});
