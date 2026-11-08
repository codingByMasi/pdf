// Home page: privacy promise, search box, and the tools grouped by category.
import { useState } from 'react';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { searchTools } from '../../shared/lib/searchTools.js';
import { groupByCategory, tools } from '../../shared/lib/toolCatalog.js';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';
import { ToolSearch } from './ToolSearch.jsx';
import { ToolCard } from './ToolCard.jsx';

export function HomePage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  usePageMeta({ title: t('home.seoTitle'), description: t('home.seoDesc'), path: '/' });

  const found = searchTools(tools, query, (tool) => `${t(`tool.${tool.id}.name`)} ${t(`tool.${tool.id}.desc`)}`);
  return (
    <>
      <section className="hero">
        <h1>{t('home.title')}</h1>
        <p className="hero-text">{t('home.subtitle')}</p>
        <p className="privacy-line">🔒 {t('home.privacy')}</p>
      </section>
      <ToolSearch query={query} onChange={setQuery} count={found.length} />
      {found.length === 0 ? <StatusMessage kind="info">{t('search.none')}</StatusMessage> : null}
      {groupByCategory(found).map(({ category, tools: group }) => (
        <section key={category} className="tool-group" aria-labelledby={`group-${category}`}>
          <h2 id={`group-${category}`}>{t(`category.${category}`)}</h2>
          <ul className="tool-grid">
            {group.map((tool) => (
              <li key={tool.id}><ToolCard tool={tool} /></li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
