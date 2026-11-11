// Tests the install manifest and the offline service worker text.
import { describe, it, expect } from 'vitest';
import { buildManifest, buildServiceWorker } from './pwa.js';

describe('pwa', () => {
  it('uses the site name and gives icons for installing', () => {
    const manifest = buildManifest('PDF Shortner');
    expect(manifest.name).toBe('PDF Shortner');
    expect(manifest.short_name.length).toBeLessThanOrEqual(12);
    expect(manifest.icons.map((i) => i.sizes)).toEqual(['192x192', '512x512']);
  });
  it('lists the files and is valid JavaScript', () => {
    const code = buildServiceWorker(['/index.html', '/assets/a.js'], 'abc');
    expect(code).toContain('"/assets/a.js"');
    expect(code).toContain("'site-abc'");
    expect(() => new Function(code)).not.toThrow();
  });
  it('never caches other websites or non-GET requests', () => {
    const code = buildServiceWorker([], 'v');
    expect(code).toContain("request.method !== 'GET'");
    expect(code).toContain('url.origin !== self.location.origin');
  });
});
