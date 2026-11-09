// "Your file is ready" panel with a download button and an optional Start over button. Nothing is sent anywhere.
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { makeDownloadUrl, freeDownloadUrl } from '../lib/downloadUrl.js';
import { Icon } from './Icon.jsx';
import { ShareLine } from './ShareLine.jsx';

export function DownloadButton({ blob, fileName, onStartOver }) {
  const { t } = useI18n();
  const [url, setUrl] = useState('');

  useEffect(() => {
    const next = blob ? makeDownloadUrl(blob) : '';
    setUrl(next);
    return () => freeDownloadUrl(next);
  }, [blob]);

  if (!url) return null;
  return (
    <div className="download" role="status">
      <span className="done-check" aria-hidden="true"><Icon name="check" size={40} /></span>
      <h3 className="download-ready">{t('download.title')}</h3>
      <p>{t('download.doneText')}</p>
      <a className="button button-primary" href={url} download={fileName}>
        {t('download.button')}
      </a>
      {onStartOver ? (
        <button type="button" className="text-button" onClick={onStartOver}>{t('download.startOver')}</button>
      ) : null}
      <ShareLine title={document.title.split(' | ')[0]} />
    </div>
  );
}
