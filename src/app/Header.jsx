// Top bar: site name link and the language switch button.
import { config } from '../config.js';
import { useI18n } from '../shared/i18n/useI18n.js';
import { Link } from '../shared/ui/Link.jsx';
import { LanguageSwitch } from './LanguageSwitch.jsx';

export function Header() {
  const { t } = useI18n();
  return (
    <header className="site-header">
      <Link to="/" className="site-name" aria-label={t('nav.home')}>{config.siteName}</Link>
      <LanguageSwitch />
    </header>
  );
}
