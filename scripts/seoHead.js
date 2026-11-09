// Puts the title, search tags, share tags, language links and text into the built index.html.
import { escapeHtml as h, languages, locales, urlFor } from './seoShared.js';

// route: { path }. lang: language of this page. Pages that exist in both languages get hreflang links.
export function applyToTemplate(html, info, route, config, lang = 'en') {
  const url = urlFor(config, lang, route.path);
  const image = `${config.siteUrl}/og/${lang}/${info.image}.jpg`;
  const tags = [
    `<meta name="description" content="${h(info.description)}" />`,
    `<meta name="robots" content="${info.noindex ? 'noindex' : 'index, follow'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${h(config.siteName)}" />`,
    `<meta property="og:title" content="${h(info.title)}" />`,
    `<meta property="og:description" content="${h(info.description)}" />`,
    `<meta property="og:locale" content="${locales[lang]}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${h(info.title)}" />`,
    `<meta name="twitter:description" content="${h(info.description)}" />`,
  ];
  if (!info.noindex) {
    tags.push(`<link rel="canonical" href="${h(url)}" />`, `<meta property="og:url" content="${h(url)}" />`);
    for (const l of languages) tags.push(`<link rel="alternate" hreflang="${l}" href="${h(urlFor(config, l, route.path))}" />`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${h(urlFor(config, 'en', route.path))}" />`);
    tags.push(`<meta property="og:image" content="${h(image)}" />`, `<meta name="twitter:image" content="${h(image)}" />`);
  }
  if (info.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(info.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${h(info.title)}</title>`)
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${info.body}</div>`);
}
