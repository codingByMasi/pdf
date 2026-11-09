// Hindi Typing screen: type Hindi with English letters ("namaste") and get Devanagari text to copy.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { EXAMPLES, transliterate } from './transliterate.js';

export default function HindiTypingTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [danda, setDanda] = usePref('hindityping.danda', '1');
  const [digits, setDigits] = usePref('hindityping.digits', '0');
  const out = useMemo(() => transliterate(text, { danda: danda === '1', digits: digits === '1' }), [text, danda, digits]);
  const check = (label, value, set) => <label className="choice"><input type="checkbox" checked={value === '1'} onChange={(e) => set(e.target.checked ? '1' : '0')} /><span>{label}</span></label>;
  return (
    <TextToolShell>
      <InputBox label={t('hindityping.input')} value={text} onChange={setText} rows={7} hint={t('hindityping.hint')} loadFile={false} />
      {check(t('hindityping.danda'), danda, setDanda)}
      {check(t('hindityping.digits'), digits, setDigits)}
      <OutputBox label={t('hindityping.output')} value={out} fileName="hindi.txt" rows={7} />
      <div className="data-table" role="region" aria-label={t('hindityping.examples')} tabIndex={0}>
        <table>
          <thead><tr><th>{t('hindityping.type')}</th><th>{t('hindityping.get')}</th></tr></thead>
          <tbody>{EXAMPLES.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="field-hint">{t('hindityping.rules')}</p>
    </TextToolShell>
  );
}
