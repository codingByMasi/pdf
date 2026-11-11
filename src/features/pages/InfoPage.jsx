// A text page (Privacy, Terms or Contact): title block, text sections, and the contact form.
import { config } from '../../config.js';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { ContactForm } from './ContactForm.jsx';

export function InfoPage({ page }) {
  const { t } = useI18n();
  const vars = { site: config.siteName };
  const isContact = page.id === 'contact';
  usePageMeta({ title: t(`${page.id}.seoTitle`), description: t(`${page.id}.seoDesc`, vars), path: page.path });
  return (
    <article className="info-page">
      <header className="info-hero">
        <p className="kicker">{t(isContact || page.id === 'help' ? 'info.kickerHelp' : 'info.kickerLegal')}</p>
        <h1>{t(`${page.id}.title`)}</h1>
        <p className="info-lead">{t(`${page.id}.intro`, vars)}</p>
      </header>
      <div className="info-content">
        {Array.from({ length: page.sections }, (_, i) => (
          <section key={i}>
            <h2>{t(`${page.id}.s${i + 1}.h`)}</h2>
            <p>{t(`${page.id}.s${i + 1}.p`, vars)}</p>
          </section>
        ))}
      </div>
      {isContact ? (
        <>
          <ContactForm />
          <p className="contact-direct">
            <a href={`mailto:${config.contactEmail}`}>{t('contact.emailButton', { email: config.contactEmail })}</a>
          </p>
        </>
      ) : null}
    </article>
  );
}
