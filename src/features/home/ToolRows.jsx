// Two rows above the tool list: your favourites and the tools you used lately. Both live on this device only.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { findToolById } from '../../shared/lib/toolCatalog.js';
import { useToolMemory } from '../../shared/lib/toolMemory.js';
import { ToolCard } from './ToolCard.jsx';

function Row({ id, title, ids }) {
  const list = ids.map(findToolById).filter(Boolean);
  if (!list.length) return null;
  return (
    <section className="category" aria-labelledby={id}>
      <div className="category-title"><h3 id={id}>{title}</h3></div>
      <ul className="tool-grid">{list.map((tool) => <li key={tool.id}><ToolCard tool={tool} /></li>)}</ul>
    </section>
  );
}

export function ToolRows() {
  const { t } = useI18n();
  const { recent, favourites } = useToolMemory();
  return (
    <>
      <Row id="row-fav" title={t('home.favourites')} ids={favourites} />
      <Row id="row-recent" title={t('home.recent')} ids={recent.filter((id) => !favourites.includes(id))} />
    </>
  );
}
