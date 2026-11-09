// Find and Replace Text screen: change words in pasted text, with options for case, whole words and patterns.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { replaceText } from './replaceText.js';

function Check({ label, checked, onChange }) {
  return <label className="choice"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span>{label}</span></label>;
}

export default function TextReplaceTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [opts, setOpts] = useState({ matchCase: false, wholeWord: false, regex: false });
  const result = useMemo(() => (text && find ? replaceText(text, { find, replace, ...opts }) : null), [text, find, replace, opts]);
  const set = (key) => (value) => setOpts((now) => ({ ...now, [key]: value }));
  return (
    <TextToolShell>
      <InputBox label={t('replace.input')} value={text} onChange={setText} rows={9} />
      <div className="form-fields">
        <TextField label={t('replace.find')} value={find} onChange={(e) => setFind(e.target.value)} />
        <TextField label={t('replace.with')} value={replace} onChange={(e) => setReplace(e.target.value)} />
      </div>
      <Check label={t('replace.matchCase')} checked={opts.matchCase} onChange={set('matchCase')} />
      <Check label={t('replace.wholeWord')} checked={opts.wholeWord} onChange={set('wholeWord')} />
      <Check label={t('replace.regex')} checked={opts.regex} onChange={set('regex')} />
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{t('replace.badPattern')}</StatusMessage> : null}
      {result?.ok ? <StatusMessage kind="info">{t('replace.count', { count: result.count })}</StatusMessage> : null}
      <OutputBox label={t('text.result')} value={result?.ok ? result.text : ''} rows={9} />
    </TextToolShell>
  );
}
