// "Tell a friend" line with a Share button (phone share sheet) and a Copy link button. Nothing is tracked.
import { useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { Icon } from './Icon.jsx';

function pageUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

export function ShareLine({ title }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function share() {
    try {
      await navigator.share({ title, text: t('share.text', { name: title }), url: pageUrl() });
    } catch {
      /* the visitor closed the share sheet: nothing to do */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setCopied(true);
    } catch {
      window.prompt(t('share.copy'), pageUrl());
    }
  }

  return (
    <div className="share-line">
      <p>{t('share.line')}</p>
      <div className="share-buttons">
        {canShare ? (
          <button type="button" className="button button-secondary" onClick={share}><Icon name="share" size={18} /> {t('share.button')}</button>
        ) : null}
        <button type="button" className="button button-secondary" onClick={copy}><Icon name="link" size={18} /> {t('share.copy')}</button>
      </div>
      <span role="status" className="share-status">{copied ? t('share.copied') : ''}</span>
    </div>
  );
}
