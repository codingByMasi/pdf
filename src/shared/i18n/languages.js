// The languages. English is always loaded (it is the fallback). The others load only when a visitor needs them.
import { en } from './en.js';

export const languages = { en };
export const fallbackLanguage = en;

const loaders = { hi: () => import('./hi.js').then((module) => module.hi) };

export const hasLanguage = (code) => code in languages || code in loaders;

export async function loadLanguage(code) {
  if (!languages[code] && loaders[code]) languages[code] = await loaders[code]();
  return languages[code];
}
