// Tests for validateFile.
import { describe, it, expect } from 'vitest';
import { validateFile } from './validateFile.js';

const opts = { kind: 'pdf', maxBytes: 1000 };
const file = (name, size, type = '') => ({ name, size, type });

describe('validateFile', () => {
  it('accepts a normal PDF', () => {
    expect(validateFile(file('a.PDF', 10, 'application/pdf'), opts).ok).toBe(true);
  });
  it('accepts a PDF with no type given', () => {
    expect(validateFile(file('a.pdf', 10), opts).ok).toBe(true);
  });
  it('rejects the wrong type', () => {
    expect(validateFile(file('a.png', 10, 'image/png'), opts).errorKey).toBe('error.wrongType');
    expect(validateFile(file('pdf', 10), opts).errorKey).toBe('error.wrongType');
    expect(validateFile(file('a.pdf', 10, 'text/html'), opts).errorKey).toBe('error.wrongType');
  });
  it('rejects empty and huge files', () => {
    expect(validateFile(file('a.pdf', 0), opts).errorKey).toBe('error.empty');
    expect(validateFile(file('a.pdf', 5000), opts).errorKey).toBe('error.tooBig');
  });
  it('accepts images for the image kind', () => {
    expect(validateFile(file('a.jpeg', 10, 'image/jpeg'), { kind: 'image', maxBytes: 100 }).ok).toBe(true);
  });
});
