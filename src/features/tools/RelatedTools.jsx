// "Related tools" block at the bottom of a tool page: up to 4 tools of the same group, the group page, and the guide if there is one.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Link } from '../../shared/ui/Link.jsx';
import { tools } from '../../shared/lib/toolCatalog.js';
import { ToolCard } from '../home/ToolCard.jsx';
import { hubForCategory } from '../hubs/hubList.js';
import { guideForTool } from '../guides/guideList.js';
import { guideTextFor } from '../guides/guideText.js';

export function RelatedTools({ tool }) {
  const { t, lang } = useI18n();
  const others = tools.filter((x) => x.category === tool.category && x.id !== tool.id).slice(0, 4);
  const hub = hubForCategory(tool.category);
  const guide = guideForTool(tool.id);
  return (
    <section className="related-section" aria-labelledby="related-heading">
      {guide ? (
        <p className="related-guide"><Link to={guide.path}>{t('guides.forTool', { title: guideTextFor(lang, guide.slug).title })}</Link></p>
      ) : null}
      {others.length ? (
        <>
          <h2 id="related-heading">{t('related.heading')}</h2>
          <ul className="tool-grid">{others.map((x) => <li key={x.id}><ToolCard tool={x} /></li>)}</ul>
        </>
      ) : null}
      <p className="related-hub"><Link to={hub.path}>{t('related.hub', { category: t(`category.${tool.category}`) })}</Link></p>
    </section>
  );
}
