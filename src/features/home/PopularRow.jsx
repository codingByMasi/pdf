// The most-used tools, always visible at the top of the tool list.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { findToolById } from '../../shared/lib/toolCatalog.js';
import { ToolCard } from './ToolCard.jsx';

export const popularIds = ['merge', 'split', 'compress', 'editPdf', 'sign', 'jpgToPdf', 'pdfToJpg', 'rotate', 'delete', 'organize'];

export function PopularRow() {
  const { t } = useI18n();
  return (
    <section className="category" aria-labelledby="row-popular">
      <div className="category-title"><h3 id="row-popular">{t('home.popular')}</h3></div>
      <ul className="tool-grid">
        {popularIds.map(findToolById).filter(Boolean).map((tool) => <li key={tool.id}><ToolCard tool={tool} /></li>)}
      </ul>
    </section>
  );
}
