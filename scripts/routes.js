// List of every page address (home, tools, group pages, guides, text pages), used by sitemap and prerender.
import { tools } from '../src/shared/lib/toolCatalog.js';
import { pages } from '../src/features/pages/pageList.js';
import { guides, guidesPath } from '../src/features/guides/guideList.js';
import { hubs } from '../src/features/hubs/hubList.js';

export function allRoutes() {
  return [
    { kind: 'home', id: 'home', path: '/' },
    ...tools.map((tool) => ({ kind: 'tool', id: tool.id, path: tool.path })),
    ...hubs.map((hub) => ({ kind: 'hub', id: hub.category, path: hub.path })),
    { kind: 'guides', id: 'guides', path: guidesPath },
    ...guides.map((guide) => ({ kind: 'guide', id: guide.slug, path: guide.path, tool: guide.tool })),
    ...pages.map((page) => ({ kind: 'page', id: page.id, path: page.path, sections: page.sections })),
  ];
}
