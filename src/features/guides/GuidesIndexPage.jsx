// The list of all how-to guides.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Link } from '../../shared/ui/Link.jsx';
import { guides, guidesPath } from './guideList.js';
import { guideTextFor } from './guideText.js';

export function GuidesIndexPage() {
  const { t, lang } = useI18n();
  usePageMeta({ title: t('guides.seoTitle'), description: t('guides.seoDesc'), path: guidesPath });
  return (
    <article className="info-page">
      <header className="info-hero">
        <p className="kicker">{t('guides.kicker')}</p>
        <h1>{t('guides.title')}</h1>
        <p className="info-lead">{t('guides.intro')}</p>
      </header>
      <ul className="guide-list">
        {guides.map((g) => {
          const text = guideTextFor(lang, g.slug);
          return (
            <li key={g.slug}>
              <Link to={g.path} className="guide-card">
                <span className="guide-card-title">{text.title}</span>
                <span className="guide-card-desc">{text.desc}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
