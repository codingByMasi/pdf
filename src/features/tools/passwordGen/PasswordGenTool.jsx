// Password Maker screen: makes strong random passwords on the device. Nothing is saved or sent.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { makePassword, strengthBits } from './makePassword.js';

const KINDS = ['lower', 'upper', 'digits', 'symbols', 'easy'];

export default function PasswordGenTool() {
  const { t } = useI18n();
  const [length, setLength] = usePref('pw.length', '16');
  const [on, setOn] = usePref('pw.kinds', 'lower,upper,digits,easy');
  const kinds = on.split(',');
  const options = () => ({ length: Number(length), ...Object.fromEntries(KINDS.map((k) => [k, kinds.includes(k)])) });
  const [password, setPassword] = useState(() => makePassword());
  const toggle = (k) => setOn(kinds.includes(k) ? kinds.filter((x) => x !== k).join(',') : [...kinds, k].join(','));
  const bits = strengthBits(password);
  const level = bits >= 80 ? 'strong' : bits >= 55 ? 'ok' : 'weak';
  return (
    <TextToolShell>
      <TextField label={t('pw.length')} type="number" inputMode="numeric" min="4" max="128" value={length} onChange={(e) => setLength(e.target.value)} />
      <fieldset className="choice-group">
        <legend className="field-label">{t('pw.use')}</legend>
        {KINDS.map((k) => <label key={k} className="choice"><input type="checkbox" checked={kinds.includes(k)} onChange={() => toggle(k)} /><span>{t(`pw.${k}`)}</span></label>)}
      </fieldset>
      <Button onClick={() => setPassword(makePassword(options()))}>{t('run.passwordGen')}</Button>
      <OutputBox label={t('pw.result')} value={password} fileName="password.txt" rows={2} />
      {password ? <p>{t('pw.strength', { level: t(`pw.${level}`), bits })}</p> : <p>{t('pw.pick')}</p>}
    </TextToolShell>
  );
}
