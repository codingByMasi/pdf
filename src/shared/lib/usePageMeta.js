// Sets the tab title, search description, canonical and language links, and share tags for a page.
import { useEffect } from 'react';
import { config } from '../../config.js';
import { useI18n } from '../i18n/useI18n.js';
import { addressFor, pageTitle } from './pageTitle.js';

const LOCALES = { en: 'en_US', hi: 'hi_IN' };
let firstPage = null;

function setTag(selector, create, attribute, value) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute(attribute, value);
}

function meta(attribute, name) {
  return () => {
    const tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    return tag;
  };
}

const link = (rel, hreflang) => () => Object.assign(document.createElement('link'), { rel, ...(hreflang ? { hreflang } : {}) });
const web = (lang, path) => `${config.siteUrl}${addressFor(lang, path) === '/' ? '' : addressFor(lang, path)}`;

export function usePageMeta({ title, description, path, image = 'default', noindex = false }) {
  const { lang } = useI18n();
  useEffect(() => {
    const full = pageTitle(title, config.siteName);
    document.title = full;
    const desc = description ?? '';
    // Structured data written at build time belongs to the first page only. Remove it when the visitor moves on.
    const key = `${lang}${path}`;
    if (firstPage === null) firstPage = key;
    else if (firstPage !== key) document.head.querySelectorAll('script[type="application/ld+json"]').forEach((node) => node.remove());
    setTag('meta[name="description"]', meta('name', 'description'), 'content', desc);
    setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', full);
    setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', desc);
    setTag('meta[property="og:locale"]', meta('property', 'og:locale'), 'content', LOCALES[lang]);
    setTag('meta[name="twitter:title"]', meta('name', 'twitter:title'), 'content', full);
    setTag('meta[name="twitter:description"]', meta('name', 'twitter:description'), 'content', desc);
    setTag('meta[name="robots"]', meta('name', 'robots'), 'content', noindex ? 'noindex' : 'index, follow');
    if (path === undefined) return;
    const picture = `${config.siteUrl}/og/${lang}/${image}.jpg`;
    setTag('meta[property="og:image"]', meta('property', 'og:image'), 'content', picture);
    setTag('meta[name="twitter:image"]', meta('name', 'twitter:image'), 'content', picture);
    setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', web(lang, path));
    setTag('link[rel="canonical"]', link('canonical'), 'href', web(lang, path));
    for (const l of ['en', 'hi']) setTag(`link[rel="alternate"][hreflang="${l}"]`, link('alternate', l), 'href', web(l, path));
    setTag('link[rel="alternate"][hreflang="x-default"]', link('alternate', 'x-default'), 'href', web('en', path));
  }, [title, description, path, image, noindex, lang]);
}
