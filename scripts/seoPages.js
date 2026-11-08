// Builds the search-engine version of each page: title, description, tags and plain text content.
import { groupByCategory, tools } from '../src/shared/lib/toolCatalog.js';

const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

// en: the English text file. Returns { title, description, body, jsonLd }.
export function describeRoute(route, en, config) {
  const vars = { site: config.siteName, email: config.contactEmail };
  const t = (key) => fill(en[key], vars);
  const full = (title) => `${title} | ${config.siteName}`;

  if (route.kind === 'home') {
    return {
      title: full(t('home.seoTitle')),
      description: t('home.seoDesc'),
      jsonLd: null,
      body:
        `<h1>${escapeHtml(t('home.title'))}</h1><p>${escapeHtml(t('home.subtitle'))}</p><p>${escapeHtml(t('home.privacy'))}</p>` +
        groupByCategory(tools)
          .map(
            ({ category, tools: group }) =>
              `<h2>${escapeHtml(t(`category.${category}`))}</h2><ul>${group
                .map((tool) => `<li><a href="${tool.path}">${escapeHtml(t(`tool.${tool.id}.name`))}</a> - ${escapeHtml(t(`tool.${tool.id}.desc`))}</li>`)
                .join('')}</ul>`,
          )
          .join(''),
    };
  }
  if (route.kind === 'tool') {
    const p = `tool.${route.id}.`;
    const faq = [1, 2].map((n) => ({ q: t(`${p}faq${n}q`), a: t(`${p}faq${n}a`) }));
    return {
      title: full(t(`${p}seoTitle`)),
      description: t(`${p}seoDesc`),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      body:
        `<h1>${escapeHtml(t(`${p}name`))}</h1><p>${escapeHtml(t(`${p}desc`))}</p>` +
        `<h2>${escapeHtml(t('tool.howTo'))}</h2><ol>${[1, 2, 3].map((n) => `<li>${escapeHtml(t(`${p}step${n}`))}</li>`).join('')}</ol>` +
        `<h2>${escapeHtml(t('tool.faq'))}</h2>${faq.map(({ q, a }) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`).join('')}`,
    };
  }
  const p = `${route.id}.`;
  const sections = Array.from({ length: route.sections }, (_, i) => `<h2>${escapeHtml(t(`${p}s${i + 1}.h`))}</h2><p>${escapeHtml(t(`${p}s${i + 1}.p`))}</p>`);
  return {
    title: full(t(`${p}title`)),
    description: t(`${p}seoDesc`),
    jsonLd: null,
    body: `<h1>${escapeHtml(t(`${p}title`))}</h1><p>${escapeHtml(t(`${p}intro`))}</p>${sections.join('')}`,
  };
}

// Page shown for unknown addresses. Hidden from search engines.
export function describeNotFound(en) {
  return { title: en['notfound.title'], description: en['notfound.text'], jsonLd: null, noindex: true, body: `<h1>${escapeHtml(en['notfound.title'])}</h1><p>${escapeHtml(en['notfound.text'])}</p>` };
}

// Puts the title, tags and text into the built index.html.
export function applyToTemplate(html, info, route, config) {
  const url = `${config.siteUrl}${route.path === '/' ? '' : route.path}`;
  const tags = [
    `<meta name="description" content="${escapeHtml(info.description)}" />`,
    `<meta name="robots" content="${info.noindex ? 'noindex' : 'index, follow'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(config.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(info.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(info.description)}" />`,
  ];
  if (!info.noindex) {
    tags.push(`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  if (info.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(info.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(info.title)}</title>`)
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${info.body}</div>`);
}
