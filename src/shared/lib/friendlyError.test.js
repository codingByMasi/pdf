// Tests for friendlyErrorKey.
import { describe, it, expect } from 'vitest';
import { friendlyErrorKey } from './friendlyError.js';

describe('friendlyErrorKey', () => {
  it('detects password-protected files', () => {
    expect(friendlyErrorKey(new Error('Input document is encrypted'))).toBe('error.password');
    expect(friendlyErrorKey({ name: 'PasswordException' })).toBe('error.password');
  });
  it('detects broken files', () => {
    expect(friendlyErrorKey(new Error('Failed to parse PDF'))).toBe('error.corrupt');
    expect(friendlyErrorKey({ name: 'InvalidPDFException' })).toBe('error.corrupt');
  });
  it('falls back to a general message', () => {
    expect(friendlyErrorKey(new Error('boom'))).toBe('error.generic');
    expect(friendlyErrorKey(undefined)).toBe('error.generic');
  });
});
