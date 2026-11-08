// The short "how to use" guide: 3 numbered cards.
import { useI18n } from '../../shared/i18n/useI18n.js';

export function HowToSteps({ toolId }) {
  const { t } = useI18n();
  return (
    <section className="how-section" aria-labelledby="howto-heading">
      <p className="kicker">{t('tool.howKicker')}</p>
      <h2 id="howto-heading">{t('tool.howTo')}</h2>
      <ol className="steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className="step">
            <span className="step-number" aria-hidden="true">{`0${n}`}</span>
            <p>{t(`tool.${toolId}.step${n}`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
