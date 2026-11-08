// Button that switches between English and Hindi (globe icon; the word hides on tiny screens).
import { useI18n } from '../shared/i18n/useI18n.js';
import { Icon } from '../shared/ui/Icon.jsx';

export function LanguageSwitch() {
  const { t, lang, setLang } = useI18n();
  const next = lang === 'en' ? 'hi' : 'en';
  return (
    <button type="button" className="language-button" lang={next} aria-label={t('lang.switchLabel')} onClick={() => setLang(next)}>
      <Icon name="globe" size={20} />
      <span className="language-word">{t('lang.other')}</span>
    </button>
  );
}
