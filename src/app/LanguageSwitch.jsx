// Button that switches between English and Hindi.
import { useI18n } from '../shared/i18n/useI18n.js';

export function LanguageSwitch() {
  const { t, lang, setLang } = useI18n();
  const next = lang === 'en' ? 'hi' : 'en';
  return (
    <button type="button" className="button button-light" lang={next} aria-label={t('lang.switchLabel')} onClick={() => setLang(next)}>
      {t('lang.other')}
    </button>
  );
}
