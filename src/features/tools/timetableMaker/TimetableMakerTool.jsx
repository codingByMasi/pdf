// Timetable Maker screen: choose days and periods, type what happens in each square, download a landscape PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { tFor } from '../docKit/tFor.js';
import { timetablePdf } from './timetablePdf.js';

export default function TimetableMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const [days, setDays] = usePref('timetable.days', '5');
  const [periods, setPeriods] = usePref('timetable.periods', '6');
  const [title, setTitle] = useState('');
  const [cells, setCells] = useState({});
  const [times, setTimes] = useState({});
  const d = Number(days);
  const p = Number(periods);
  const make = async () => ({
    ...(await timetablePdf({
      title, days: d, periods: p, accent: style.accent,
      cells: Array.from({ length: d }, (_, r) => Array.from({ length: p }, (__, c) => cells[`${r}-${c}`] ?? '')),
      times: Array.from({ length: p }, (_, c) => times[c] ?? ''),
    }, await tFor(style.docLang))),
    fileName: 'timetable.pdf',
  });
  return (
    <DocShell toolId="timetableMaker" make={make}>
      {style.controls}
      <TextField label={t('timetable.title')} value={title} onChange={(e) => setTitle(e.target.value)} hint={t('timetable.titleHint')} />
      <ChoiceGroup chips legend={t('timetable.days')} value={days} onChange={setDays} options={[{ value: '5', label: t('timetable.d5') }, { value: '6', label: t('timetable.d6') }]} />
      <ChoiceGroup chips legend={t('timetable.periods')} value={periods} onChange={setPeriods} options={[4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: String(n) }))} />
      <div className="form-fields">
        {Array.from({ length: p }, (_, c) => <TextField key={c} label={t('timetable.timeOf', { n: c + 1 })} value={times[c] ?? ''} onChange={(e) => setTimes((now) => ({ ...now, [c]: e.target.value }))} />)}
      </div>
      {Array.from({ length: d }, (_, r) => (
        <fieldset key={r} className="list-item">
          <legend className="field-label">{t(`cal.dFull.${(r + 1) % 7}`)}</legend>
          <div className="form-fields">
            {Array.from({ length: p }, (__, c) => <TextField key={c} label={t('timetable.cellOf', { n: c + 1 })} value={cells[`${r}-${c}`] ?? ''} onChange={(e) => setCells((now) => ({ ...now, [`${r}-${c}`]: e.target.value }))} />)}
          </div>
        </fieldset>
      ))}
    </DocShell>
  );
}
