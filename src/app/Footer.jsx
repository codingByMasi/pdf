// Dark bottom bar: logo, short line, page links, copyright and the ad slot (hidden while ads are off).
import { config } from '../config.js';
import { useI18n } from '../shared/i18n/useI18n.js';
import { AdSlot } from '../shared/ui/AdSlot.jsx';
import { Link } from '../shared/ui/Link.jsx';
import { pages } from '../features/pages/pageList.js';
import { BrandName } from './BrandName.jsx';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <AdSlot name="footer" />
        <div>
          <Link to="/" className="brand footer-brand" aria-label={t('nav.home')}><BrandName /></Link>
          <p>{t('footer.tagline')}</p>
        </div>
        <nav className="footer-links" aria-label={t('nav.footerLabel')}>
          {pages.map((page) => (
            <Link key={page.id} to={page.path}>{t(`${page.id}.title`)}</Link>
          ))}
        </nav>
        <p className="footer-privacy">{t('home.privacy')}</p>
        <small>{t('footer.copy', { year: new Date().getFullYear(), site: config.siteName })}</small>
      </div>
    </footer>
  );
}
