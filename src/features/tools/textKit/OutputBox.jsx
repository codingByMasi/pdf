// Read-only result box with Copy and Download buttons.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { saveBlob } from './saveBlob.js';

export function OutputBox({ label, value, fileName = 'result.txt', rows = 8 }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="output-box">
      <TextField label={label} multiline readOnly rows={rows} value={value} onFocus={(e) => e.target.select()} />
      <div className="editor-actions">
        <Button variant="secondary" disabled={!value} onClick={copy}>{copied ? t('base64.copied') : t('text.copy')}</Button>
        <Button variant="secondary" disabled={!value} onClick={() => saveBlob(new Blob([value], { type: 'text/plain;charset=utf-8' }), fileName)}>{t('text.download')}</Button>
      </div>
    </div>
  );
}
