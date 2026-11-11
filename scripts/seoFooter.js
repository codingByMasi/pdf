// The footer page links (About, Privacy, Terms and more) as plain HTML, so crawlers that do not run scripts, like Google's advert check, can find them.
import { pages } from '../src/features/pages/pageList.js';
import { addressFor } from '../src/shared/lib/pageTitle.js';
import { escapeHtml as h } from './seoShared.js';

export function footerLinks(text, lang) {
  const items = [{ path: '/guides', label: text['guides.title'] }, ...pages.map((p) => ({ path: p.path, label: text[`${p.id}.title`] }))];
  const links = items.map((i) => `<a href="${h(addressFor(lang, i.path))}">${h(i.label)}</a>`).join(' ');
  return `<nav aria-label="${h(text['nav.footerLabel'])}">${links}</nav>`;
}
