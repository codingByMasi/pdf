// Home page: heading, privacy promise and the grid of tools.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { usePageTitle } from '../../shared/lib/usePageTitle.js';
import { tools } from '../tools/toolList.js';
import { ToolCard } from './ToolCard.jsx';

export function HomePage() {
  const { t } = useI18n();
  usePageTitle('');
  return (
    <>
      <section className="hero">
        <h1>{t('home.title')}</h1>
        <p className="hero-text">{t('home.subtitle')}</p>
        <p className="privacy-line">🔒 {t('home.privacy')}</p>
      </section>
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="visually-hidden">{t('home.toolsHeading')}</h2>
        <ul className="tool-grid">
          {tools.map((tool) => (
            <li key={tool.id}><ToolCard tool={tool} /></li>
          ))}
        </ul>
      </section>
    </>
  );
}
