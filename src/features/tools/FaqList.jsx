// Questions and answers for a tool, as open-and-close rows with a plus or minus.
import { useI18n } from '../../shared/i18n/useI18n.js';

export function FaqList({ toolId }) {
  const { t } = useI18n();
  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div>
        <p className="kicker">{t('tool.faqKicker')}</p>
        <h2 id="faq-heading">{t('tool.faq')}</h2>
        <p className="faq-text">{t('tool.faqText')}</p>
      </div>
      <div className="faqs">
        {[1, 2].map((n) => (
          <details key={n} className="faq-item">
            <summary>{t(`tool.${toolId}.faq${n}q`)}</summary>
            <p>{t(`tool.${toolId}.faq${n}a`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
