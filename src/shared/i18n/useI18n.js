// Hook that gives components t(key), the language, and setLang.
import { useContext } from 'react';
import { I18nContext } from './i18nContext.js';

export function useI18n() {
  return useContext(I18nContext);
}
