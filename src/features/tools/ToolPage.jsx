// Page for one tool: title, working area, 3-step guide and questions.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageTitle } from '../../shared/lib/usePageTitle.js';
import { Link } from '../../shared/ui/Link.jsx';
import { ToolWorkspace } from './ToolWorkspace.jsx';
import { HowToSteps } from './HowToSteps.jsx';
import { FaqList } from './FaqList.jsx';

export function ToolPage({ tool }) {
  const { t } = useI18n();
  const name = t(`tool.${tool.id}.name`);
  usePageTitle(name);
  return (
    <>
      <Link to="/" className="back-link">← {t('tool.backHome')}</Link>
      <section className="hero">
        <h1>{name}</h1>
        <p className="hero-text">{t(`tool.${tool.id}.desc`)}</p>
      </section>
      <ToolWorkspace tool={tool} />
      <HowToSteps toolId={tool.id} />
      <FaqList toolId={tool.id} />
    </>
  );
}
