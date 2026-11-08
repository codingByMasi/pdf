// Two-part language switch: English and Hindi buttons with a globe icon (the icon hides on tiny screens).
import { useI18n } from '../shared/i18n/useI18n.js';
import { Icon } from '../shared/ui/Icon.jsx';

export function LanguageSwitch() {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="language-switch" role="group" aria-label={t('lang.groupLabel')}>
      <Icon name="globe" size={18} />
      <button type="button" lang="en" aria-pressed={lang === 'en'} aria-label={t('lang.nameEn')} className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
        {t('lang.shortEn')}
      </button>
      <button type="button" lang="hi" aria-pressed={lang === 'hi'} className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>
        {t('lang.nameHi')}
      </button>
    </div>
  );
}
