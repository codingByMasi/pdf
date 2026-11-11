// Tests for the search-engine pages (English and Hindi), structured data and the sitemap.
import { describe, it, expect } from 'vitest';
import { config } from '../src/config.js';
import { en } from '../src/shared/i18n/en.js';
import { hi } from '../src/shared/i18n/hi.js';
import { pages } from '../src/features/pages/pageList.js';
import { tools } from '../src/shared/lib/toolCatalog.js';
import { guides } from '../src/features/guides/guideList.js';
import { hubs } from '../src/features/hubs/hubList.js';
import { allRoutes } from './routes.js';
import { applyToTemplate } from './seoHead.js';
import { describeNotFound, describeRoute } from './seoPages.js';
import { buildRobots, buildSitemap } from './sitemap.js';

const routes = allRoutes();
const total = 1 + tools.length + hubs.length + 1 + guides.length + pages.length;
const texts = { en, hi };
const infos = (lang) => routes.map((route) => ({ route, info: describeRoute(route, texts[lang], config, lang) }));
const template = '<html lang="en"><head><title>x</title></head><body><div id="root"></div></body></html>';

describe('routes', () => {
  it('has every page with a unique address', () => {
    expect(routes).toHaveLength(total);
    expect(new Set(routes.map((r) => r.path)).size).toBe(total);
  });
});

for (const lang of ['en', 'hi']) {
  describe(`describeRoute (${lang})`, () => {
    const list = infos(lang);
    it('gives every page its own title and description of a good length', () => {
      expect(new Set(list.map((i) => i.info.title)).size).toBe(total);
      expect(new Set(list.map((i) => i.info.description)).size).toBe(total);
      for (const { route, info } of list) {
        expect(info.title.length, route.path).toBeLessThanOrEqual(70);
        expect(info.description.length, route.path).toBeGreaterThanOrEqual(40);
        expect(info.description.length, route.path).toBeLessThanOrEqual(160);
        expect(info.body, route.path).toContain('<h1>');
      }
    });
    it('links to every tool and guide from the home page text, in the right language', () => {
      const home = list.find((i) => i.route.kind === 'home').info.body;
      const prefix = lang === 'hi' ? '/hi' : '';
      for (const tool of tools) expect(home, tool.id).toContain(`href="${prefix}${tool.path}"`);
      for (const g of guides) expect(home, g.slug).toContain(`href="${prefix}${g.path}"`);
    });
    it('adds structured data to every page except the text pages', () => {
      for (const { route, info } of list) expect(Boolean(info.jsonLd), route.path).toBe(route.kind !== 'page');
    });
    it('gives tool pages app, how-to, questions and breadcrumb data that match the visible text', () => {
      const merge = list.find((i) => i.route.id === 'merge');
      const types = merge.info.jsonLd['@graph'].map((x) => x['@type']);
      expect(types).toEqual(['WebApplication', 'HowTo', 'FAQPage', 'BreadcrumbList']);
      for (const step of merge.info.jsonLd['@graph'][1].step) expect(merge.info.body).toContain(step.text.replace(/&/g, '&amp;'));
      expect(JSON.stringify(merge.info.jsonLd)).not.toMatch(/aggregateRating|review/i);
    });
    it('puts the tool group in the breadcrumb and a tool list on group pages', () => {
      const merge = list.find((i) => i.route.id === 'merge').info.jsonLd['@graph'].find((x) => x['@type'] === 'BreadcrumbList');
      expect(merge.itemListElement).toHaveLength(3);
      const hub = list.find((i) => i.route.kind === 'hub' && i.route.id === 'organize').info.jsonLd['@graph'][0];
      expect(hub.mainEntity.itemListElement.length).toBeGreaterThan(3);
    });
    it('points every tool, guide and group page to a share image name', () => {
      for (const { route, info } of list) expect(info.image, route.path).toBe(route.kind === 'tool' ? route.id : route.kind === 'guide' ? route.tool : 'default');
    });
  });
}

describe('applyToTemplate', () => {
  it('fills in title, tags, canonical address, language links and text', () => {
    const merge = infos('hi').find((i) => i.route.id === 'merge');
    const html = applyToTemplate(template, merge.info, merge.route, config, 'hi');
    expect(html).toContain(`<title>${merge.info.title}</title>`);
    expect(html).toContain('<html lang="hi"');
    expect(html).toContain(`<link rel="canonical" href="${config.siteUrl}/hi/merge-pdf" />`);
    expect(html).toContain(`hreflang="en" href="${config.siteUrl}/merge-pdf"`);
    expect(html).toContain(`hreflang="hi" href="${config.siteUrl}/hi/merge-pdf"`);
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain(`og:image" content="${config.siteUrl}/og/hi/merge.jpg"`);
    expect(html).toContain('twitter:card" content="summary_large_image"');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('<div id="root"><h1>');
  });
  it('escapes dangerous characters', () => {
    const info = { title: 'a "b" <c>', description: 'x" onload="y', jsonLd: { t: '</script>' }, body: '', image: 'default' };
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
  const xml = buildSitemap(routes, 'https://site.test', '2026-01-02');
  it('lists every page once in each language, with language links', () => {
    expect(xml.match(/<loc>/g)).toHaveLength(total * 2);
    expect(xml).toContain('<loc>https://site.test/</loc>');
    expect(xml).toContain('<loc>https://site.test/hi</loc>');
    expect(xml).toContain('<loc>https://site.test/hi/merge-pdf</loc>');
    expect(xml).toContain('hreflang="hi" href="https://site.test/hi/merge-pdf"');
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>');
  });
  it('points robots.txt to the sitemap', () => {
    expect(buildRobots('https://site.test')).toContain('Sitemap: https://site.test/sitemap.xml');
  });
});
