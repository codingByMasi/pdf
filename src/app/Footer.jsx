// Dark bottom bar: logo, short line, page links, copyright and the ad slot (hidden while ads are off).
import { useState } from 'react';
import { config } from '../config.js';
import { useI18n } from '../shared/i18n/useI18n.js';
import { clearPrefs } from '../shared/lib/usePref.js';
import { AdSlot } from '../shared/ui/AdSlot.jsx';
import { InstallButton } from '../shared/ui/InstallButton.jsx';
import { Link } from '../shared/ui/Link.jsx';
import { hubs } from '../features/hubs/hubList.js';
import { pages } from '../features/pages/pageList.js';
import { BrandName } from './BrandName.jsx';

export function Footer() {
  const { t } = useI18n();
  const [forgot, setForgot] = useState(false);
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <AdSlot name="footer" />
        <div>
          <Link to="/" className="brand footer-brand" aria-label={t('nav.home')}><BrandName /></Link>
          <p>{t('footer.tagline')}</p>
        </div>
        <nav className="footer-links" aria-label={t('nav.footerLabel')}>
          <Link to="/guides">{t('guides.title')}</Link>
          {pages.map((page) => (
            <Link key={page.id} to={page.path}>{t(`${page.id}.title`)}</Link>
          ))}
        </nav>
        <nav className="footer-links footer-groups" aria-label={t('hub.kicker')}>
          {hubs.map((hub) => <Link key={hub.category} to={hub.path}>{t(`category.${hub.category}`)}</Link>)}
        </nav>
        <p className="footer-privacy">{t('home.privacy')}</p>
        <p className="footer-forget">
          <button type="button" className="forget-button" onClick={() => { clearPrefs(); setForgot(true); }}>{t('settings.forget')}</button>
          <InstallButton className="forget-button" />
          <span role="status">{forgot ? t('settings.forgotten') : ''}</span>
        </p>
        <small>{t('footer.copy', { year: new Date().getFullYear(), site: config.siteName })}</small>
      </div>
    </footer>
  );
}
