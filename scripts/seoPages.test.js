// Tests for the search-engine pages and the sitemap.
import { describe, it, expect } from 'vitest';
import { config } from '../src/config.js';
import { en } from '../src/shared/i18n/en.js';
import { pages } from '../src/features/pages/pageList.js';
import { tools } from '../src/shared/lib/toolCatalog.js';
import { allRoutes } from './routes.js';
import { applyToTemplate, describeNotFound, describeRoute } from './seoPages.js';
import { buildRobots, buildSitemap } from './sitemap.js';

const routes = allRoutes();
const total = 1 + tools.length + pages.length;
const infos = routes.map((route) => ({ route, info: describeRoute(route, en, config) }));
const template = '<html><head><title>x</title></head><body><div id="root"></div></body></html>';

describe('routes', () => {
  it('has home, every tool and every text page with unique addresses', () => {
    expect(routes).toHaveLength(total);
    expect(new Set(routes.map((r) => r.path)).size).toBe(total);
  });
});

describe('describeRoute', () => {
  it('gives every page its own title and description of a good length', () => {
    expect(new Set(infos.map((i) => i.info.title)).size).toBe(total);
    expect(new Set(infos.map((i) => i.info.description)).size).toBe(total);
    for (const { route, info } of infos) {
      expect(info.title.length, route.path).toBeLessThanOrEqual(70);
      expect(info.description.length, route.path).toBeGreaterThanOrEqual(40);
      expect(info.description.length, route.path).toBeLessThanOrEqual(160);
      expect(info.body, route.path).toContain('<h1>');
    }
  });
  it('links to every tool from the home page text', () => {
    const home = infos.find((i) => i.route.kind === 'home').info.body;
    for (const tool of tools) expect(home, tool.id).toContain(`href="${tool.path}"`);
  });
  it('adds questions data to tool pages only', () => {
    for (const { route, info } of infos) expect(Boolean(info.jsonLd), route.path).toBe(route.kind === 'tool');
  });
});

describe('applyToTemplate', () => {
  it('fills in title, tags, canonical address and text', () => {
    const merge = infos.find((i) => i.route.id === 'merge');
    const html = applyToTemplate(template, merge.info, merge.route, config);
    expect(html).toContain(`<title>${merge.info.title}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${config.siteUrl}/merge-pdf" />`);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('<div id="root"><h1>');
  });
  it('escapes dangerous characters', () => {
    const info = { title: 'a "b" <c>', description: 'x" onload="y', jsonLd: { t: '</script>' }, body: '' };
    const html = applyToTemplate(template, info, { path: '/x' }, config);
    expect(html).not.toContain('<c>');
    expect(html).not.toContain('"y"');
    expect(html).not.toContain('</script>"');
  });
  it('hides the 404 page from search engines', () => {
    const html = applyToTemplate(template, describeNotFound(en), { path: '/404' }, config);
    expect(html).toContain('content="noindex"');
    expect(html).not.toContain('canonical');
  });
});

describe('sitemap and robots', () => {
  it('lists every page once', () => {
    const xml = buildSitemap(routes, 'https://site.test', '2026-01-02');
    expect(xml.match(/<loc>/g)).toHaveLength(total);
    expect(xml).toContain('<loc>https://site.test/</loc>');
    expect(xml).toContain('<loc>https://site.test/merge-pdf</loc>');
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>');
  });
  it('points robots.txt to the sitemap', () => {
    expect(buildRobots('https://site.test')).toContain('Sitemap: https://site.test/sitemap.xml');
  });
});
