// The "page not found" screen.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageTitle } from '../../shared/lib/usePageTitle.js';
import { Link } from '../../shared/ui/Link.jsx';

export function NotFoundPage() {
  const { t } = useI18n();
  usePageTitle(t('notfound.title'));
  return (
    <section className="hero">
      <h1>{t('notfound.title')}</h1>
      <p className="hero-text">{t('notfound.text')}</p>
      <Link to="/" className="button button-primary">{t('notfound.home')}</Link>
    </section>
  );
}
