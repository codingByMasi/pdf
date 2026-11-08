// The "page not found" screen.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Icon } from '../../shared/ui/Icon.jsx';
import { Link } from '../../shared/ui/Link.jsx';

export function NotFoundPage() {
  const { t } = useI18n();
  usePageMeta({ title: t('notfound.title'), description: t('notfound.text'), noindex: true });
  return (
    <section className="not-found">
      <p className="not-found-big" aria-hidden="true">{t('notfound.big')}</p>
      <span className="lost-file" aria-hidden="true"><Icon name="file" size={38} /></span>
      <h1>{t('notfound.title')}</h1>
      <p>{t('notfound.text')}</p>
      <Link to="/" className="button button-primary">{t('notfound.home')}</Link>
    </section>
  );
}
