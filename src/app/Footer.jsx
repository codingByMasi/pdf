// Bottom bar: privacy promise and the ad slot (hidden while ads are off).
import { useI18n } from '../shared/i18n/useI18n.js';
import { AdSlot } from '../shared/ui/AdSlot.jsx';
import { Link } from '../shared/ui/Link.jsx';
import { pages } from '../features/pages/pageList.js';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <AdSlot name="footer" />
      <nav className="footer-links" aria-label={t('nav.footerLabel')}>
        {pages.map((page) => (
          <Link key={page.id} to={page.path}>{t(`${page.id}.title`)}</Link>
        ))}
      </nav>
      <p>{t('home.privacy')}</p>
    </footer>
  );
}
