// Big text box for pasting text, with a button to load a text file from the device and one to clear.
import { useRef } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { decodeText } from '../../../shared/lib/decodeText.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';

const MAX = 5 * 1024 * 1024;

export function InputBox({ label, value, onChange, hint, rows = 8, loadFile = true }) {
  const { t } = useI18n();
  const picker = useRef(null);
  const load = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || file.size > MAX) return;
    onChange(decodeText(new Uint8Array(await file.arrayBuffer())));
  };
  return (
    <div className="input-box">
      <TextField label={label} multiline rows={rows} value={value} hint={hint} onChange={(e) => onChange(e.target.value)} spellCheck="false" />
      <div className="editor-actions">
        {loadFile ? <Button variant="secondary" onClick={() => picker.current?.click()}>{t('text.load')}</Button> : null}
        <Button variant="secondary" disabled={!value} onClick={() => onChange('')}>{t('text.clear')}</Button>
      </div>
      {loadFile ? <input ref={picker} type="file" accept=".txt,.json,.csv,.md,.html,.xml,text/*,application/json" className="visually-hidden" tabIndex={-1} aria-hidden="true" onChange={load} /> : null}
    </div>
  );
}
