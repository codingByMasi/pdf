// Page for one tool: title, working area, 3-step guide and questions.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Link } from '../../shared/ui/Link.jsx';
import { Suspense } from 'react';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';
import { toolScreens } from './toolRegistry.js';
import { HowToSteps } from './HowToSteps.jsx';
import { FaqList } from './FaqList.jsx';

export function ToolPage({ tool }) {
  const { t } = useI18n();
  const name = t(`tool.${tool.id}.name`);
  const Screen = toolScreens[tool.id];
  usePageMeta({ title: t(`tool.${tool.id}.seoTitle`), description: t(`tool.${tool.id}.seoDesc`), path: tool.path });
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
