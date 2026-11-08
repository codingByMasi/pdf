// Page for one tool: title, working area, 3-step guide and questions.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageTitle } from '../../shared/lib/usePageTitle.js';
import { Link } from '../../shared/ui/Link.jsx';
import { Suspense } from 'react';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';
import { toolScreens, placeholderScreen } from './toolRegistry.js';
import { HowToSteps } from './HowToSteps.jsx';
import { FaqList } from './FaqList.jsx';

export function ToolPage({ tool }) {
  const { t } = useI18n();
  const name = t(`tool.${tool.id}.name`);
  const Screen = toolScreens[tool.id] ?? placeholderScreen;
  usePageTitle(name);
  return (
    <>
      <Link to="/" className="back-link">← {t('tool.backHome')}</Link>
      <section className="hero">
        <h1>{name}</h1>
        <p className="hero-text">{t(`tool.${tool.id}.desc`)}</p>
      </section>
      <Suspense fallback={<StatusMessage kind="info">{t('tool.loading')}</StatusMessage>}>
        <Screen tool={tool} />
      </Suspense>
      <HowToSteps toolId={tool.id} />
      <FaqList toolId={tool.id} />
    </>
  );
}
