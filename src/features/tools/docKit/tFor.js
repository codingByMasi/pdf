// Gives a t(key, vars) for a chosen language, so a PDF can be made in English or Hindi whatever the site language is.
import { languages, fallbackLanguage } from '../../../shared/i18n/languages.js';
import { translate } from '../../../shared/i18n/translate.js';

export function tFor(lang) {
  const dict = languages[lang] ?? fallbackLanguage;
  return (key, vars) => translate(dict, fallbackLanguage, key, vars);
}
