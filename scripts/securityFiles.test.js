// Checks the security headers and the security.txt file are present and well formed.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (p) => readFileSync(new URL(`../public/${p}`, import.meta.url), 'utf8');

describe('security files', () => {
  it('sends the main security headers', () => {
    const h = read('_headers');
    for (const name of ['Content-Security-Policy', 'X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Strict-Transport-Security: max-age=31536000', 'Cross-Origin-Opener-Policy', 'Cross-Origin-Resource-Policy: same-origin']) {
      expect(h, name).toContain(name);
    }
  });
  it('does not use includeSubDomains or preload by accident', () => {
    expect(read('_headers')).not.toMatch(/includeSubDomains|preload/);
  });
  it('has a security.txt with contact, a future expiry date and the canonical address', () => {
    const t = read('.well-known/security.txt');
    expect(t).toMatch(/^Contact: mailto:\S+@\S+/m);
    const expires = /^Expires: (\S+)/m.exec(t)?.[1];
    expect(Date.parse(expires)).toBeGreaterThan(Date.now() + 30 * 86400000);
    expect(t).toContain('Canonical: https://pdfshortener.com/.well-known/security.txt');
  });
});
