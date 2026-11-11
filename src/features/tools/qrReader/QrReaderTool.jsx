// QR Reader screen: choose a photo or screenshot that has a QR code and read what it says. Runs on this device.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { loadImage, drawImage } from '../../../shared/lib/imageIO.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { FilePick } from '../textKit/FilePick.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';

const MAX_SIDE = 1600;

export default function QrReaderTool() {
  const { t } = useI18n();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [state, setState] = useState('idle');
  const [copied, setCopied] = useState(false);

  async function pick(f) {
    setFile(f);
    setText('');
    setCopied(false);
    if (!f) return setState('idle');
    setState('working');
    try {
      const [{ default: jsQR }, image] = await Promise.all([import('jsqr'), loadImage(f)]);
      const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
      const canvas = drawImage(image, Math.round(image.width * scale), Math.round(image.height * scale), '#ffffff');
      const pixels = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
      const found = jsQR(pixels.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
      if (found?.data) { setText(found.data); setState('found'); } else setState('none');
    } catch {
      setState('error');
    }
  }
  const isLink = /^https?:\/\//i.test(text);
  return (
    <TextToolShell>
      <p className="field-hint">{t('qrread.hint')}</p>
      <FilePick file={file} accept="image/*" onPick={pick} />
      {state === 'working' ? <StatusMessage kind="info">{t('file.reading')}</StatusMessage> : null}
      {state === 'none' ? <StatusMessage title={t('error.heading')}>{t('qrread.none')}</StatusMessage> : null}
      {state === 'error' ? <StatusMessage title={t('error.heading')}>{t('error.imageBad')}</StatusMessage> : null}
      {state === 'found' ? (
        <>
          <p className="field-label">{t('qrread.result')}</p>
          <pre className="qr-result" tabIndex={0}>{text}</pre>
          <div className="editor-actions">
            <Button onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); } }}>{t('saved.copy')}</Button>
          </div>
          {isLink ? <p className="field-hint">{t('qrread.linkWarn')}</p> : null}
          <span role="status" className="share-status">{copied ? t('saved.copied') : ''}</span>
        </>
      ) : null}
    </TextToolShell>
  );
}
