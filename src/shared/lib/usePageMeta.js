// Sets the tab title, search description, canonical address and "hide from search" flag for a page.
import { useEffect } from 'react';
import { config } from '../../config.js';

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

export function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    const full = title ? `${title} | ${config.siteName}` : config.siteName;
    document.title = full;
    setTag('meta[name="description"]', meta('name', 'description'), 'content', description ?? '');
    setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', full);
    setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', description ?? '');
    setTag('meta[name="robots"]', meta('name', 'robots'), 'content', noindex ? 'noindex' : 'index, follow');
    const canonical = path === undefined ? null : `${config.siteUrl}${path === '/' ? '' : path}`;
    if (canonical) {
      setTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', canonical);
    }
  }, [title, description, path, noindex]);
}
