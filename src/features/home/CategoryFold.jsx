// One group of tools as a tap-to-open row. The tool links stay in the page, so search engines still see them.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Link } from '../../shared/ui/Link.jsx';
import { hubForCategory } from '../hubs/hubList.js';
import { ToolCard } from './ToolCard.jsx';

export function CategoryFold({ category, tools, open = false }) {
  const { t } = useI18n();
  return (
    <details className="category fold" id={`group-${category}`} open={open || undefined}>
      <summary className="fold-summary">
        <span className="fold-title">{t(`category.${category}`)}</span>
        <span className="count-badge">{tools.length}</span>
      </summary>
      <ul className="tool-grid">
        {tools.map((tool) => <li key={tool.id}><ToolCard tool={tool} /></li>)}
      </ul>
      <p className="fold-hub"><Link to={hubForCategory(category).path}>{t('related.hub', { category: t(`category.${category}`) })}</Link></p>
    </details>
  );
}
