// Keeps the chosen language (remembered on this device) and gives t() to the app.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { config } from '../../config.js';
import { I18nContext } from './i18nContext.js';
import { languages, fallbackLanguage } from './languages.js';
import { translate } from './translate.js';

const STORAGE_KEY = 'language';

function startLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages[saved]) return saved;
  } catch {
    // Storage may be blocked; that is fine.
  }
  const browser = (navigator.language || '').slice(0, 2);
  return languages[browser] ? browser : config.defaultLang;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(startLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!languages[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore blocked storage.
    }
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(languages[lang], fallbackLanguage, key, vars),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
