// One card on the home page: coloured icon tile, tool name, one-line description and an arrow.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Icon } from '../../shared/ui/Icon.jsx';
import { Link } from '../../shared/ui/Link.jsx';

export function ToolCard({ tool }) {
  const { t } = useI18n();
  return (
    <Link to={tool.path} className="tool-card">
      <span className={`tool-icon tone-${tool.category}`} aria-hidden="true"><Icon name={tool.icon} /></span>
      <span className="tool-copy">
        <span className="tool-name">{t(`tool.${tool.id}.name`)}</span>
        <span className="tool-desc">{t(`tool.${tool.id}.desc`)}</span>
      </span>
      <span className="card-arrow" aria-hidden="true"><Icon name="arrow" size={20} /></span>
    </Link>
  );
}
