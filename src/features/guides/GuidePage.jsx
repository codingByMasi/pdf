// One how-to guide: title, intro, numbered steps, tips, and a link to the tool it is about.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageMeta } from '../../shared/lib/usePageMeta.js';
import { Link } from '../../shared/ui/Link.jsx';
import { Icon } from '../../shared/ui/Icon.jsx';
import { findToolById } from '../../shared/lib/toolCatalog.js';
import { ShareLine } from '../../shared/ui/ShareLine.jsx';
import { guidesPath, GUIDE_DATE } from './guideList.js';
import { guideTextFor } from './guideText.js';

export function GuidePage({ guide }) {
  const { t, lang } = useI18n();
  const text = guideTextFor(lang, guide.slug);
  const tool = findToolById(guide.tool);
  usePageMeta({ title: text.title, description: text.desc, path: guide.path, image: guide.tool });
  return (
    <article className="info-page guide-page">
      <nav className="breadcrumb" aria-label={t('guides.title')}>
        <Link to="/" className="breadcrumb-link">{t('nav.homeShort')}</Link>
        <Icon name="arrow" size={16} />
        <Link to={guidesPath} className="breadcrumb-link">{t('guides.title')}</Link>
        <Icon name="arrow" size={16} />
        <span aria-current="page" className="crumb-current">{text.title}</span>
      </nav>
      <header className="info-hero">
        <p className="kicker">{t('guides.kicker')}</p>
        <h1>{text.title}</h1>
        <p className="info-lead">{text.intro}</p>
      </header>
      <div className="info-content">
        <section>
          <h2>{t('guides.stepsHeading')}</h2>
          <ol className="guide-steps">{text.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <Link to={tool.path} className="button button-primary guide-open">{t('guides.openTool', { tool: t(`tool.${tool.id}.name`) })}</Link>
        </section>
        <section>
          <h2>{t('guides.tipsHeading')}</h2>
          <ul className="guide-tips">{text.tips.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>
        <p className="guide-date">{t('guides.updated', { date: GUIDE_DATE })}</p>
        <ShareLine title={text.title} />
      </div>
    </article>
  );
}
