// Top bar: logo, main links, language button and the menu button for small screens.
import { useState } from 'react';
import { useI18n } from '../shared/i18n/useI18n.js';
import { Icon } from '../shared/ui/Icon.jsx';
import { ThemeSwitch } from '../shared/ui/ThemeSwitch.jsx';
import { Link } from '../shared/ui/Link.jsx';
import { BrandName } from './BrandName.jsx';
import { LanguageSwitch } from './LanguageSwitch.jsx';

const links = [
  { to: '/', key: 'nav.tools' },
  { to: '/guides', key: 'nav.guides' },
  { to: '/privacy', key: 'privacy.title' },
  { to: '/contact', key: 'contact.title' },
];

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label={t('nav.home')} onClick={() => setOpen(false)}>
          <BrandName />
        </Link>
        <nav id="main-nav" className={`nav${open ? ' nav-open' : ''}`} aria-label={t('nav.mainLabel')}>
          {links.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link" onClick={() => setOpen(false)}>
              {t(item.key)}
            </Link>
          ))}
          <ThemeSwitch className="theme-in-menu" />
        </nav>
        <div className="header-actions">
          <ThemeSwitch className="theme-in-bar" />
          <LanguageSwitch />
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={t(open ? 'nav.menuClose' : 'nav.menu')}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
