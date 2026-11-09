// Line Tools screen: remove repeated lines, sort, reverse, trim, number or shuffle lines of text.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { OPS, runLineOp } from './lineOps.js';

export default function LineToolsTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [op, setOp] = usePref('lines.op', 'dedupe');
  const [again, setAgain] = useState(0);
  const out = useMemo(() => (text ? runLineOp(op, text) : ''), [text, op, again]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <TextToolShell>
      <InputBox label={t('lines.input')} value={text} onChange={setText} rows={9} />
      <ChoiceGroup chips legend={t('lines.op')} value={op} onChange={setOp} options={OPS.map((v) => ({ value: v, label: t(`lines.${v}`) }))} />
      {op === 'shuffle' ? <Button variant="secondary" onClick={() => setAgain(again + 1)}>{t('lines.again')}</Button> : null}
      <OutputBox label={t('text.result')} value={out} rows={9} />
    </TextToolShell>
  );
}
