// List of every page address on the site (home, 8 tools, 3 text pages), used by sitemap and prerender.
import { tools } from '../src/features/tools/toolList.js';
import { pages } from '../src/features/pages/pageList.js';

export function allRoutes() {
  return [
    { kind: 'home', id: 'home', path: '/' },
    ...tools.map((tool) => ({ kind: 'tool', id: tool.id, path: tool.path })),
    ...pages.map((page) => ({ kind: 'page', id: page.id, path: page.path, sections: page.sections })),
  ];
}
