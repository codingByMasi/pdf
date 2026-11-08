// The short "how to use" list of 3 steps for a tool.
import { useI18n } from '../../shared/i18n/useI18n.js';

export function HowToSteps({ toolId }) {
  const { t } = useI18n();
  return (
    <section className="info-section" aria-labelledby="howto-heading">
      <h2 id="howto-heading">{t('tool.howTo')}</h2>
      <ol className="steps">
        {[1, 2, 3].map((n) => (
          <li key={n}>{t(`tool.${toolId}.step${n}`)}</li>
        ))}
      </ol>
    </section>
  );
}
