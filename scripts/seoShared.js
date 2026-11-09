// Small helpers shared by the search-page scripts: escaping, {blanks}, addresses and languages.
import { addressFor } from '../src/shared/lib/pageTitle.js';

export const languages = ['en', 'hi'];
export const locales = { en: 'en_US', hi: 'hi_IN' };

export const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

// Full web address of a page in a language, with no slash at the end except for the English home page.
export function urlFor(config, lang, path) {
  const address = addressFor(lang, path);
  return `${config.siteUrl}${address === '/' ? '/' : address}`;
}

// File inside dist/ for a page: "/merge-pdf" -> merge-pdf.html, "/hi" -> hi.html, "/" -> index.html.
export function fileFor(lang, path) {
  const address = addressFor(lang, path);
  return address === '/' ? 'index.html' : `${address.slice(1)}.html`;
}
