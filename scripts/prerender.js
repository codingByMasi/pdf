// After the build: writes one ready-made page per address, so search engines see the real text.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.js';
import { en } from '../src/shared/i18n/en.js';
import { allRoutes } from './routes.js';
import { applyToTemplate, describeNotFound, describeRoute } from './seoPages.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

for (const route of allRoutes()) {
  // "/merge-pdf" becomes merge-pdf.html. Cloudflare Pages serves it at /merge-pdf.
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  mkdirSync(dirname(join(dist, file)), { recursive: true });
  writeFileSync(join(dist, file), applyToTemplate(template, describeRoute(route, en, config), route, config));
}
// Cloudflare Pages sends this file, with a real "not found" status, for unknown addresses.
writeFileSync(join(dist, '404.html'), applyToTemplate(template, describeNotFound(en), { path: '/404' }, config));
console.log(`Prerendered ${allRoutes().length} pages and 404.html`);
