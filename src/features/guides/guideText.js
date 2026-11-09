// Gives the guide words for a language, and the guide for a tool in that language.
import { guideTextEn } from './guideTextEn.js';
import { guideTextHi } from './guideTextHi.js';

export const guideTexts = { en: guideTextEn, hi: guideTextHi };
export const guideTextFor = (lang, slug) => (guideTexts[lang] ?? guideTextEn)[slug];
