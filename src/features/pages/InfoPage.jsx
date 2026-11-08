// A plain text page (Privacy, Terms or Contact) built from the text files.
import { config } from '../../config.js';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Link } from '../../shared/ui/Link.jsx';

export function InfoPage({ page }) {
  const { t } = useI18n();
  const vars = { site: config.siteName };
  usePageMeta({ title: t(`${page.id}.title`), description: t(`${page.id}.seoDesc`, vars), path: page.path });
  return (
    <article className="info-page">
      <Link to="/" className="back-link">← {t('tool.backHome')}</Link>
      <h1>{t(`${page.id}.title`)}</h1>
      <p className="hero-text">{t(`${page.id}.intro`, vars)}</p>
      {Array.from({ length: page.sections }, (_, i) => (
        <section key={i} className="info-section">
          <h2>{t(`${page.id}.s${i + 1}.h`)}</h2>
          <p>{t(`${page.id}.s${i + 1}.p`, vars)}</p>
        </section>
      ))}
      {page.id === 'contact' ? (
        <a className="button button-primary" href={`mailto:${config.contactEmail}`}>
          {t('contact.emailButton', { email: config.contactEmail })}
        </a>
      ) : null}
    </article>
  );
}
