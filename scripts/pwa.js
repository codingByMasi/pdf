// After the build: writes the install manifest and the offline service worker (which keeps a copy of every site file).
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../src/config.js';

const SKIP = new Set(['sw.js', '_headers', 'robots.txt', 'sitemap.xml', 'ads.txt', '.well-known/security.txt']);
// Share pictures are for social sites, not for offline use.
const isShare = (f) => f.startsWith('/og/');

export function buildManifest(name) {
  return {
    name,
    short_name: name.length > 12 ? name.slice(0, 12) : name,
    description: 'Free tools for PDFs, photos and documents that run in your browser. Your files never leave your device.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f9faf7',
    theme_color: '#2e63e6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}

// files: site paths like "/assets/app.js". version: any text that changes when the files change.
export function buildServiceWorker(files, version) {
  return `// Offline copy of the site. Files are kept on this device only.
const CACHE = 'site-${version}';
const FILES = ${JSON.stringify(files)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

function pageFor(path) {
  if (path === '/' || path === '') return '/index.html';
  return /\\.[a-z0-9]+$/i.test(path) ? path : path.replace(/\\/$/, '') + '.html';
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(pageFor(url.pathname)).then((hit) => hit || caches.match('/404.html'))),
    );
    return;
  }
  event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
});
`;
}

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const files = listFiles(dist).map((f) => `/${relative(dist, f).split('\\').join('/')}`).filter((f) => !SKIP.has(f.slice(1)) && !isShare(f)).sort();
  const hash = createHash('sha256');
  for (const f of files) hash.update(f).update(String(statSync(join(dist, f)).size));
  writeFileSync(join(dist, 'manifest.webmanifest'), JSON.stringify(buildManifest(config.siteName), null, 2));
  writeFileSync(join(dist, 'sw.js'), buildServiceWorker([...files, '/manifest.webmanifest'].filter((f, i, a) => a.indexOf(f) === i), hash.digest('hex').slice(0, 12)));
  console.log(`Wrote the offline service worker with ${files.length} files and the install manifest`);
}
