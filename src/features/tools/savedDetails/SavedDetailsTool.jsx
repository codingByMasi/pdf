// Saved Details screen: your name, address and phone kept on this device only, each with a Copy button.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';

const FIELDS = ['name', 'father', 'dob', 'phone', 'email', 'address', 'city', 'state', 'pin'];

export default function SavedDetailsTool() {
  const { t } = useI18n();
  const [data, setData] = usePref('saved.details', {});
  const [copied, setCopied] = useState('');
  const set = (key, value) => setData({ ...data, [key]: value });
  async function copy(key, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      setCopied('');
    }
  }
  const labels = [...FIELDS.map((k) => [k, t(`saved.f.${k}`)]), ['x1', t('saved.extra', { n: 1 })], ['x2', t('saved.extra', { n: 2 })]];
  const all = labels.filter(([k]) => data[k]).map(([k, l]) => `${l}: ${data[k]}`).join('\n');
  return (
    <TextToolShell>
      <p className="field-hint">{t('saved.hint')}</p>
      {labels.map(([key, label]) => (
        <div key={key} className="saved-row">
          <TextField label={label} value={data[key] ?? ''} onChange={(e) => set(key, e.target.value)} multiline={key === 'address'} rows={key === 'address' ? 2 : undefined} autoComplete="off" />
          <Button variant="secondary" disabled={!data[key]} onClick={() => copy(key, data[key])}>{t('saved.copy')}</Button>
        </div>
      ))}
      <div className="editor-actions">
        <Button variant="secondary" disabled={!all} onClick={() => copy('all', all)}>{t('saved.copyAll')}</Button>
        <Button variant="secondary" disabled={!Object.keys(data).length} onClick={() => { setData({}); setCopied(''); }}>{t('saved.clear')}</Button>
      </div>
      <span role="status" className="share-status">{copied ? t('saved.copied') : ''}</span>
    </TextToolShell>
  );
}
