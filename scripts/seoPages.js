// Builds the search-engine version of each page: title, description, structured data and plain text content.
import { groupByCategory, tools } from '../src/shared/lib/toolCatalog.js';
import { pageTitle } from '../src/shared/lib/pageTitle.js';
import { guides, guidesPath, GUIDE_DATE } from '../src/features/guides/guideList.js';
import { guideTextEn } from '../src/features/guides/guideTextEn.js';
import { guideTextHi } from '../src/features/guides/guideTextHi.js';
import { hubs, hubForCategory } from '../src/features/hubs/hubList.js';
import { escapeHtml as h, fill, urlFor } from './seoShared.js';
import { guideGraph, homeGraph, listGraph, toolGraph } from './seoSchema.js';

const guideTexts = { en: guideTextEn, hi: guideTextHi };
const list = (items) => `<ul>${items.join('')}</ul>`;

// text: the language file (en or hi). Returns { title, description, body, jsonLd, image }.
export function describeRoute(route, text, config, lang = 'en') {
  const vars = { site: config.siteName, email: config.contactEmail };
  const t = (key, extra = {}) => fill(text[key], { ...vars, ...extra });
  const href = (path) => urlFor({ siteUrl: '' }, lang, path) || '/';
  const link = (path, label) => `<a href="${href(path)}">${h(label)}</a>`;
  const url = urlFor(config, lang, route.path);
  const base = { siteName: config.siteName, siteUrl: config.siteUrl, url, lang, home: { name: t('nav.homeShort'), url: urlFor(config, lang, '/') } };
  const out = (title, description, body, jsonLd = null, image = 'default') => ({ title: pageTitle(title, config.siteName), description, body, jsonLd, image });

  if (route.kind === 'home') {
    const body =
      `<h1>${h(t('home.title'))}</h1><p>${h(t('home.subtitle'))}</p><p>${h(t('home.privacy'))}</p>` +
      groupByCategory(tools)
        .map(({ category, tools: group }) => `<h2>${link(hubForCategory(category).path, t(`category.${category}`))}</h2>${list(group.map((tool) => `<li>${link(tool.path, t(`tool.${tool.id}.name`))} - ${h(t(`tool.${tool.id}.desc`))}</li>`))}`)
        .join('') +
      `<h2>${h(t('guides.title'))}</h2>${list(guides.map((g) => `<li>${link(g.path, guideTexts[lang][g.slug].title)}</li>`))}`;
    return out(t('home.seoTitle'), t('home.seoDesc'), body, homeGraph(base));
  }
  if (route.kind === 'tool') {
    const p = `tool.${route.id}.`;
    const tool = tools.find((x) => x.id === route.id);
    const steps = [1, 2, 3].map((n) => t(`${p}step${n}`));
    const faq = [1, 2].map((n) => ({ q: t(`${p}faq${n}q`), a: t(`${p}faq${n}a`) }));
    const guide = guides.find((g) => g.tool === route.id);
    const same = tools.filter((x) => x.category === tool.category && x.id !== tool.id).slice(0, 4);
    const body =
      `<h1>${h(t(`${p}name`))}</h1><p>${h(t(`${p}desc`))}</p>` +
      `<h2>${h(t('tool.howTo'))}</h2><ol>${steps.map((s) => `<li>${h(s)}</li>`).join('')}</ol>` +
      `<h2>${h(t('tool.faq'))}</h2>${faq.map(({ q, a }) => `<h3>${h(q)}</h3><p>${h(a)}</p>`).join('')}` +
      (guide ? `<p>${link(guide.path, t('guides.forTool', { title: guideTexts[lang][guide.slug].title }))}</p>` : '') +
      `<h2>${h(t('related.heading'))}</h2>${list(same.map((x) => `<li>${link(x.path, t(`tool.${x.id}.name`))}</li>`))}` +
      `<p>${link(hubForCategory(tool.category).path, t('related.hub', { category: t(`category.${tool.category}`) }))}</p>`;
    return out(t(`${p}seoTitle`), t(`${p}seoDesc`), body, toolGraph({ ...base, name: t(`${p}name`), description: t(`${p}seoDesc`) }, steps, faq), route.id);
  }
  if (route.kind === 'hub') {
    const hub = hubs.find((x) => x.category === route.id);
    const name = t(`category.${route.id}`);
    const group = tools.filter((x) => x.category === route.id);
    const body = `<h1>${h(t(`hub.${route.id}.seoTitle`))}</h1><p>${h(t(`hub.${route.id}.intro`))}</p>${list(group.map((x) => `<li>${link(x.path, t(`tool.${x.id}.name`))} - ${h(t(`tool.${x.id}.desc`))}</li>`))}<p>${h(t('hub.privacy'))}</p>`;
    return out(t(`hub.${route.id}.seoTitle`), t(`hub.${route.id}.seoDesc`), body, listGraph({ ...base, url: urlFor(config, lang, hub.path), name, description: t(`hub.${route.id}.seoDesc`), parents: [] }));
  }
  if (route.kind === 'guides') {
    const body = `<h1>${h(t('guides.title'))}</h1><p>${h(t('guides.intro'))}</p>${list(guides.map((g) => `<li>${link(g.path, guideTexts[lang][g.slug].title)} - ${h(guideTexts[lang][g.slug].desc)}</li>`))}`;
    return out(t('guides.seoTitle'), t('guides.seoDesc'), body, listGraph({ ...base, name: t('guides.title'), description: t('guides.seoDesc'), parents: [] }));
  }
  if (route.kind === 'guide') {
    const g = guideTexts[lang][route.id];
    const tool = tools.find((x) => x.id === route.tool);
    const parents = [{ name: t('guides.title'), url: urlFor(config, lang, guidesPath) }];
    const body =
      `<h1>${h(g.title)}</h1><p>${h(g.intro)}</p><h2>${h(t('guides.stepsHeading'))}</h2><ol>${g.steps.map((s) => `<li>${h(s)}</li>`).join('')}</ol>` +
      `<p>${link(tool.path, t('guides.openTool', { tool: t(`tool.${tool.id}.name`) }))}</p><h2>${h(t('guides.tipsHeading'))}</h2>${list(g.tips.map((s) => `<li>${h(s)}</li>`))}`;
    return out(g.title, g.desc, body, guideGraph({ ...base, name: g.title, description: g.desc, parents }, g.steps, GUIDE_DATE), route.tool);
  }
  const p = `${route.id}.`;
  const sections = Array.from({ length: route.sections }, (_, i) => `<h2>${h(t(`${p}s${i + 1}.h`))}</h2><p>${h(t(`${p}s${i + 1}.p`))}</p>`);
  return out(t(`${p}title`), t(`${p}seoDesc`), `<h1>${h(t(`${p}title`))}</h1><p>${h(t(`${p}intro`))}</p>${sections.join('')}`);
}

// Page shown for unknown addresses. Hidden from search engines.
export function describeNotFound(en) {
  return { title: en['notfound.title'], description: en['notfound.text'], jsonLd: null, noindex: true, image: 'default', body: `<h1>${h(en['notfound.title'])}</h1><p>${h(en['notfound.text'])}</p>` };
}
