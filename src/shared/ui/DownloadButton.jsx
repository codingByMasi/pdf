// Download button for a file made in the browser. Nothing is sent anywhere.
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { makeDownloadUrl, freeDownloadUrl } from '../lib/downloadUrl.js';

export function DownloadButton({ blob, fileName }) {
  const { t } = useI18n();
  const [url, setUrl] = useState('');

  useEffect(() => {
    const next = blob ? makeDownloadUrl(blob) : '';
    setUrl(next);
    return () => freeDownloadUrl(next);
  }, [blob]);

  if (!url) return null;
  return (
    <div className="download">
      <p className="download-ready">{t('download.ready')}</p>
      <a className="button button-primary" href={url} download={fileName}>
        {t('download.button')}
      </a>
    </div>
  );
}
