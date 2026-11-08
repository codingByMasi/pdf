// After the build: writes sitemap.xml (every page) and robots.txt (points to the sitemap).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../src/config.js';
import { allRoutes } from './routes.js';

export function buildSitemap(routes, siteUrl, date) {
  const urls = routes
    .map((route) => `  <url>\n    <loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobots(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(dist, 'sitemap.xml'), buildSitemap(allRoutes(), config.siteUrl, today));
  writeFileSync(join(dist, 'robots.txt'), buildRobots(config.siteUrl));
  console.log(`Wrote sitemap.xml with ${allRoutes().length} pages and robots.txt`);
}
