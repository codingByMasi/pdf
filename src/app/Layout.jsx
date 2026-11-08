// Page frame: skip link, header, main area and footer.
import { useI18n } from '../shared/i18n/useI18n.js';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  const { t } = useI18n();
  return (
    <div className="page-frame">
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <Header />
      <main id="main" className="page-main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
