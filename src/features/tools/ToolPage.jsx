// Page for one tool: breadcrumb, title with icon, working area, trust row, 3 steps and questions.
import { Suspense, useEffect } from 'react';
import { addRecent } from '../../shared/lib/toolMemory.js';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Icon } from '../../shared/ui/Icon.jsx';
import { Link } from '../../shared/ui/Link.jsx';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';
import { TrustRow } from '../../shared/ui/TrustRow.jsx';
import { noticeFor } from '../../shared/lib/toolNotices.js';
import { toolScreens } from './toolRegistry.js';
import { HowToSteps } from './HowToSteps.jsx';
import { FaqList } from './FaqList.jsx';
import { hubForCategory } from '../hubs/hubList.js';
import { RelatedTools } from './RelatedTools.jsx';
import { FavouriteButton } from './FavouriteButton.jsx';

export function ToolPage({ tool }) {
  const { t } = useI18n();
  const name = t(`tool.${tool.id}.name`);
  const Screen = toolScreens[tool.id];
  usePageMeta({ title: t(`tool.${tool.id}.seoTitle`), description: t(`tool.${tool.id}.seoDesc`), path: tool.path, image: tool.id });
  useEffect(() => { addRecent(tool.id); }, [tool.id]);
  return (
    <div className="tool-page">
      <nav className="breadcrumb" aria-label={t('tool.backHome')}>
        <Link to="/" className="breadcrumb-link">{t('nav.homeShort')}</Link>
        <Icon name="arrow" size={16} />
        <Link to={hubForCategory(tool.category).path} className="breadcrumb-link">{t(`category.${tool.category}`)}</Link>
        <Icon name="arrow" size={16} />
        <span aria-current="page">{name}</span>
      </nav>
      <section className="tool-intro">
        <span className={`tool-page-icon tone-${tool.category}`} aria-hidden="true"><Icon name={tool.icon} size={34} /></span>
        <div>
          <h1>{name}</h1>
          <p>{t(`tool.${tool.id}.desc`)}</p>
          <FavouriteButton toolId={tool.id} />
        </div>
      </section>
      <Suspense fallback={<div className="screen-loading"><StatusMessage kind="info">{t('tool.loading')}</StatusMessage></div>}>
        <Screen tool={tool} />
      </Suspense>
      {noticeFor(tool.id) ? <p className="legal-note">{t(noticeFor(tool.id))}</p> : null}
      <TrustRow />
      <HowToSteps toolId={tool.id} />
      <FaqList toolId={tool.id} />
      <RelatedTools tool={tool} />
    </div>
  );
}
