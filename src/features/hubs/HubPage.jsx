// A tool group page: short intro, every tool of the group, and the guides about them.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Link } from '../../shared/ui/Link.jsx';
import { Icon } from '../../shared/ui/Icon.jsx';
import { tools } from '../../shared/lib/toolCatalog.js';
import { ToolCard } from '../home/ToolCard.jsx';
import { guides } from '../guides/guideList.js';
import { guideTextFor } from '../guides/guideText.js';

export function HubPage({ hub }) {
  const { t, lang } = useI18n();
  const group = tools.filter((tool) => tool.category === hub.category);
  const related = guides.filter((g) => group.some((tool) => tool.id === g.tool));
  const name = t(`category.${hub.category}`);
  usePageMeta({ title: t(`hub.${hub.category}.seoTitle`), description: t(`hub.${hub.category}.seoDesc`), path: hub.path });
  return (
    <article className="info-page hub-page">
      <nav className="breadcrumb" aria-label={name}>
        <Link to="/" className="breadcrumb-link">{t('nav.homeShort')}</Link>
        <Icon name="arrow" size={16} />
        <span aria-current="page">{name}</span>
      </nav>
      <header className="info-hero">
        <p className="kicker">{t('hub.kicker')}</p>
        <h1>{t(`hub.${hub.category}.seoTitle`)}</h1>
        <p className="info-lead">{t(`hub.${hub.category}.intro`)}</p>
      </header>
      <h2 className="hub-heading">{t('hub.tools')}</h2>
      <ul className="tool-grid">
        {group.map((tool) => <li key={tool.id}><ToolCard tool={tool} /></li>)}
      </ul>
      {related.length ? (
        <>
          <h2 className="hub-heading">{t('hub.guides')}</h2>
          <ul className="guide-list">
            {related.map((g) => (
              <li key={g.slug}><Link to={g.path} className="guide-card"><span className="guide-card-title">{guideTextFor(lang, g.slug).title}</span></Link></li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="hub-privacy">{t('hub.privacy')}</p>
    </article>
  );
}
