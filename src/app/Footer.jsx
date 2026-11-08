// Bottom bar: privacy promise and the ad slot (hidden while ads are off).
import { useI18n } from '../shared/i18n/useI18n.js';
import { AdSlot } from '../shared/ui/AdSlot.jsx';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <AdSlot name="footer" />
      <p>{t('home.privacy')}</p>
    </footer>
  );
}
