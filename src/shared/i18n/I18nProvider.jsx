// Keeps the chosen language (remembered on this device) and gives t() to the app.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { config } from '../../config.js';
import { I18nContext } from './i18nContext.js';
import { languages, fallbackLanguage, hasLanguage, loadLanguage } from './languages.js';
import { translate } from './translate.js';
import { languageFromAddress, switchAddressLanguage } from '../lib/router.js';

const STORAGE_KEY = 'language';

// The address decides the language (/hi is Hindi). An English address opens in Hindi only if the visitor chose Hindi before.
function startLanguage() {
  if (languageFromAddress() === 'hi') return 'hi';
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'hi' && hasLanguage('hi')) {
      switchAddressLanguage('hi');
      return 'hi';
    }
  } catch {
    // Storage may be blocked; that is fine.
  }
  return config.defaultLang;
}

// Call before the first render: loads the words of the language the page will open in.
export async function prepareLanguage() {
  await loadLanguage(startLanguage());
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(startLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const follow = () => {
      const next = languageFromAddress();
      loadLanguage(next).then(() => setLangState(next));
    };
    window.addEventListener('popstate', follow);
    return () => window.removeEventListener('popstate', follow);
  }, []);

  const setLang = useCallback(async (next) => {
    if (!hasLanguage(next)) return;
    await loadLanguage(next);
    setLangState(next);
    switchAddressLanguage(next);
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
