// Percentage Calculator screen: four common percentage questions with a plain-words answer.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { MODES, calcPercent, tidy } from './calcPercent.js';

export default function PercentCalcTool() {
  const { t } = useI18n();
  const [mode, setMode] = usePref('pct.mode', 'of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const r = useMemo(() => (a !== '' && b !== '' ? calcPercent(mode, a, b) : null), [mode, a, b]);
  const answer = !r?.ok ? [] : mode === 'plusMinus'
    ? [{ label: t('pct.plus'), value: tidy(r.value) }, { label: t('pct.minus'), value: tidy(r.minus) }]
    : [{ label: t(`pct.result.${mode}`), value: mode === 'of' ? tidy(r.value) : `${tidy(r.value)}%` }];
  return (
    <TextToolShell>
      <ChoiceGroup legend={t('pct.mode')} value={mode} onChange={setMode} options={MODES.map((v) => ({ value: v, label: t(`pct.q.${v}`) }))} />
      <div className="form-fields">
        <TextField label={t(`pct.a.${mode}`)} type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} />
        <TextField label={t(`pct.b.${mode}`)} type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      {r && !r.ok ? <StatusMessage title={t('error.heading')}>{t(r.errorKey ?? 'pct.bad')}</StatusMessage> : null}
      {answer.length ? <ResultGrid items={answer} /> : null}
    </TextToolShell>
  );
}
