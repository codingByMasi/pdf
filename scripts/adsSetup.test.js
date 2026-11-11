// Tests for the AdSense build step: ads.txt text and the security-rule change.
import { describe, expect, it } from 'vitest';
import { addAdSources, adsHeaders, buildAdsTxt, isValidPublisherId } from './adsSetup.js';

describe('adsSetup', () => {
  it('writes the ads.txt line without the ca- prefix', () => {
    expect(buildAdsTxt('ca-pub-1234567890123456')).toBe('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
  });
  it('checks the publisher id', () => {
    expect(isValidPublisherId('ca-pub-1234567890123456')).toBe(true);
    expect(isValidPublisherId('')).toBe(false);
    expect(isValidPublisherId('pub-123')).toBe(false);
  });
  it('adds ad sources only to the needed rules and keeps the others', () => {
    const out = addAdSources("default-src 'self'; script-src 'self'; frame-ancestors 'none'; style-src 'self'");
    expect(out).toContain("script-src 'self' https://pagead2.googlesyndication.com");
    expect(out).toContain("style-src 'self' 'unsafe-inline'");
    expect(out).toContain("default-src 'self'");
    expect(out).toContain("frame-ancestors 'none'");
    expect(out).not.toContain("'unsafe-eval'");
  });
  it('changes only the CSP line of a headers file', () => {
    const text = "/*\n  Content-Security-Policy: script-src 'self'\n  X-Frame-Options: DENY\n";
    const out = adsHeaders(text);
    expect(out).toContain('X-Frame-Options: DENY');
    expect(out).toContain('pagead2.googlesyndication.com');
  });
});
