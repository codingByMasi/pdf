// Home page: hero with privacy promise and search, then the tools grouped by category.
import { useState } from 'react';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { searchTools } from '../../shared/lib/searchTools.js';
import { categories, groupByCategory, tools } from '../../shared/lib/toolCatalog.js';
import { Icon } from '../../shared/ui/Icon.jsx';
import { TrustRow } from '../../shared/ui/TrustRow.jsx';
import { ToolSearch } from './ToolSearch.jsx';
import { ToolCard } from './ToolCard.jsx';
import { Link } from '../../shared/ui/Link.jsx';
import { hubForCategory } from '../hubs/hubList.js';
import { ToolRows } from './ToolRows.jsx';

export function HomePage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  usePageMeta({ title: t('home.seoTitle'), description: t('home.seoDesc'), path: '/' });

  const found = searchTools(tools, query, (tool) => `${t(`tool.${tool.id}.name`)} ${t(`tool.${tool.id}.desc`)}`);
  return (
    <>
      <section className="home-hero">
        <span className="hero-orb orb-one" aria-hidden="true" />
        <span className="hero-orb orb-two" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow">
            <span className="eyebrow-icon" aria-hidden="true"><Icon name="shield" size={18} /></span>
            {t('home.eyebrow')}
          </p>
          <h1>{t('home.heroA')} <em>{t('home.heroB')}</em></h1>
          <p className="hero-text">{t('home.subtitle')}</p>
          <p className="privacy-note"><Icon name="lock" size={18} />{t('home.privacy')}</p>
          <ToolSearch query={query} onChange={setQuery} count={found.length} />
          <TrustRow />
        </div>
      </section>
      <section id="tools" className="tools-section" aria-labelledby="tools-heading">
        <div className="section-heading">
          <div>
            <p className="kicker">{t('home.kicker', { count: tools.length, groups: categories.length })}</p>
            <h2 id="tools-heading">{t('home.allTools')}</h2>
          </div>
          <p>{t('home.toolsText')}</p>
        </div>
        {query.trim() ? null : (
          <nav className="category-jump" aria-label={t('home.jump')}>
            {groupByCategory(tools).map(({ category }) => <a key={category} href={`#group-${category}`}>{t(`category.${category}`)}</a>)}
          </nav>
        )}
        {query.trim() ? null : <ToolRows />}
        {found.length === 0 ? <p className="no-results" role="status">{t('search.none')}</p> : null}
        {groupByCategory(found).map(({ category, tools: group }) => (
          <section key={category} className="category" aria-labelledby={`group-${category}`}>
            <div className="category-title">
              <h3 id={`group-${category}`}><Link to={hubForCategory(category).path}>{t(`category.${category}`)}</Link></h3>
              <span className="count-badge">{group.length}</span>
            </div>
            <ul className="tool-grid">
              {group.map((tool) => (
                <li key={tool.id}><ToolCard tool={tool} /></li>
              ))}
            </ul>
          </section>
        ))}
      </section>
    </>
  );
}
