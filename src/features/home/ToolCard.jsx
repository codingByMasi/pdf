// One card on the home page: icon, tool name and a one-line description.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Link } from '../../shared/ui/Link.jsx';

export function ToolCard({ tool }) {
  const { t } = useI18n();
  return (
    <Link to={tool.path} className="tool-card">
      <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
      <span className="tool-name">{t(`tool.${tool.id}.name`)}</span>
      <span className="tool-desc">{t(`tool.${tool.id}.desc`)}</span>
    </Link>
  );
}
