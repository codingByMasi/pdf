// "Install as an app" button. It only shows when the browser says the site can be installed.
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';

export function InstallButton({ className = '' }) {
  const { t } = useI18n();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const onOffer = (event) => {
      event.preventDefault();
      setOffer(event);
    };
    const onInstalled = () => setOffer(null);
    window.addEventListener('beforeinstallprompt', onOffer);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onOffer);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!offer) return null;
  return (
    <button type="button" className={className} onClick={() => { offer.prompt(); setOffer(null); }}>
      {t('install.button')}
    </button>
  );
}
