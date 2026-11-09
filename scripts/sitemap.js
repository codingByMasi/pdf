// After the build: writes sitemap.xml (every page in both languages, with language links) and robots.txt.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../src/config.js';
import { allRoutes } from './routes.js';
import { languages, urlFor } from './seoShared.js';

export function buildSitemap(routes, siteUrl, date) {
  const site = { siteUrl };
  const urls = routes.flatMap((route) =>
    languages.map((lang) => {
      const alternates = [...languages.map((l) => [l, urlFor(site, l, route.path)]), ['x-default', urlFor(site, 'en', route.path)]]
        .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}" />`)
        .join('\n');
      return `  <url>\n    <loc>${urlFor(site, lang, route.path)}</loc>\n    <lastmod>${date}</lastmod>\n${alternates}\n  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

export function buildRobots(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(dist, 'sitemap.xml'), buildSitemap(allRoutes(), config.siteUrl, today));
  writeFileSync(join(dist, 'robots.txt'), buildRobots(config.siteUrl));
  console.log(`Wrote sitemap.xml with ${allRoutes().length * languages.length} addresses and robots.txt`);
}
