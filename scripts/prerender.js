// After the build: writes one ready-made page per address and language, so search engines see the real text.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.js';
import { en } from '../src/shared/i18n/en.js';
import { hi } from '../src/shared/i18n/hi.js';
import { allRoutes } from './routes.js';
import { applyToTemplate } from './seoHead.js';
import { describeNotFound, describeRoute } from './seoPages.js';
import { fileFor, languages } from './seoShared.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const texts = { en, hi };

for (const lang of languages) {
  for (const route of allRoutes()) {
    // "/merge-pdf" becomes merge-pdf.html and "/hi/merge-pdf" becomes hi/merge-pdf.html. Cloudflare Pages serves them without ".html".
    const file = fileFor(lang, route.path);
    mkdirSync(dirname(join(dist, file)), { recursive: true });
    writeFileSync(join(dist, file), applyToTemplate(template, describeRoute(route, texts[lang], config, lang), route, config, lang));
  }
}
// Cloudflare Pages sends this file, with a real "not found" status, for unknown addresses.
writeFileSync(join(dist, '404.html'), applyToTemplate(template, describeNotFound(en), { path: '/404' }, config));
console.log(`Prerendered ${allRoutes().length * languages.length} pages (English and Hindi) and 404.html`);
