// Date Calculator screen: days between two dates, or a date plus or minus some days, months or years.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { parseDate, todayText, weekday } from '../calcKit/dates.js';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { diffDates, shiftDate } from './dateDiff.js';

export default function DateDiffTool() {
  const { t } = useI18n();
  const [mode, setMode] = usePref('datediff.mode', 'between');
  const [a, setA] = useState(todayText);
  const [b, setB] = useState(todayText);
  const [amount, setAmount] = useState({ years: '0', months: '0', days: '30' });
  const set = (key) => (e) => setAmount((now) => ({ ...now, [key]: e.target.value }));
  const diff = useMemo(() => (mode === 'between' ? diffDates(a, b) : null), [mode, a, b]);
  const shifted = useMemo(() => (mode === 'between' ? null : shiftDate(a, amount, mode === 'add' ? 1 : -1)), [mode, a, amount]);
  const result = diff ?? shifted;
  const day = shifted?.ok ? weekday(parseDate(shifted.text)) : null;
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('datediff.mode')} value={mode} onChange={setMode} options={['between', 'add', 'subtract'].map((v) => ({ value: v, label: t(`datediff.${v}`) }))} />
      <div className="form-fields">
        <TextField label={mode === 'between' ? t('datediff.from') : t('datediff.start')} type="date" value={a} onChange={(e) => setA(e.target.value)} />
        {mode === 'between' ? <TextField label={t('datediff.to')} type="date" value={b} onChange={(e) => setB(e.target.value)} /> : null}
      </div>
      {mode === 'between' ? null : (
        <div className="form-fields">
          {['years', 'months', 'days'].map((k) => <TextField key={k} label={t(`datediff.${k}`)} type="number" inputMode="numeric" min="0" value={amount[k]} onChange={set(k)} />)}
        </div>
      )}
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{t(result.errorKey)}</StatusMessage> : null}
      {diff?.ok ? (
        <ResultGrid items={[
          { label: t('datediff.gap'), value: t('age.ymd', { years: diff.years, months: diff.months, days: diff.days }) },
          { label: t('datediff.totalDays'), value: diff.totalDays },
          { label: t('datediff.weeks'), value: t('datediff.weeksText', { weeks: diff.totalWeeks, days: diff.weeksRest }) },
          { label: t('datediff.inclusive'), value: diff.inclusiveDays },
        ]} />
      ) : null}
      {shifted?.ok ? <ResultGrid items={[{ label: t('datediff.newDate'), value: shifted.text }, { label: t('age.weekday'), value: t(`weekday.${day}`) }]} /> : null}
    </TextToolShell>
  );
}
