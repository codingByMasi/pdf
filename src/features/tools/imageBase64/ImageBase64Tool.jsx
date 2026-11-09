// Image to Base64 screen: turns a picture into text (a data address) that can be pasted into web pages or code.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';

const SHOW_LIMIT = 200_000;

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

export default function ImageBase64Tool({ tool }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const run = async ({ file }) => {
    const url = await toDataUrl(file);
    setText(url);
    setCopied(false);
    return { blob: new Blob([url], { type: 'text/plain;charset=utf-8' }), fileName: 'image-base64.txt', noteKey: url.length > SHOW_LIMIT ? 'base64.big' : undefined };
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      document.getElementById('base64-out')?.select();
    }
  }
  return (
    <ImageEditScreen tool={tool} run={run} details={false}>
      {text && text.length <= SHOW_LIMIT ? (
        <div className="field">
          <label className="field-label" htmlFor="base64-out">{t('base64.label')}</label>
          <textarea id="base64-out" className="field-input field-area" rows={5} readOnly value={text} onFocus={(e) => e.target.select()} />
          <Button variant="secondary" onClick={copy}>{copied ? t('base64.copied') : t('base64.copy')}</Button>
        </div>
      ) : null}
    </ImageEditScreen>
  );
}
