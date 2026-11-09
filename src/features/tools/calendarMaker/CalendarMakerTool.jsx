// Calendar Maker screen: a whole year on one page, or one big month with room to write. English or Hindi names.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { tFor } from '../docKit/tFor.js';
import { calendarPdf } from './calendarPdf.js';

export default function CalendarMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const now = new Date();
  const [mode, setMode] = usePref('cal.mode', 'year');
  const [year, setYear] = usePref('cal.year', String(now.getFullYear()));
  const [month, setMonth] = usePref('cal.month', String(now.getMonth() + 1));
  const [startDay, setStartDay] = usePref('cal.start', '0');
  const y = Number(year);
  const ok = Number.isInteger(y) && y >= 1900 && y <= 2200;
  const make = async () => ({ ...(await calendarPdf({ mode, year: y, month, startDay: Number(startDay), accent: style.accent }, tFor(style.docLang))), fileName: mode === 'year' ? `calendar-${y}.pdf` : `calendar-${y}-${month}.pdf` });
  return (
    <DocShell toolId="calendarMaker" make={make} canRun={ok}>
      {style.controls}
      <ChoiceGroup chips legend={t('cal.mode')} value={mode} onChange={setMode} options={[{ value: 'year', label: t('cal.year') }, { value: 'month', label: t('cal.monthOne') }]} />
      <TextField label={t('cal.yearLabel')} type="number" inputMode="numeric" min="1900" max="2200" value={year} onChange={(e) => setYear(e.target.value)} />
      {mode === 'month' ? (
        <div className="field">
          <label className="field-label" htmlFor="cal-month">{t('cal.monthLabel')}</label>
          <select id="cal-month" className="field-input" value={month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{t(`cal.m.${i + 1}`)}</option>)}
          </select>
        </div>
      ) : null}
      <ChoiceGroup chips legend={t('cal.startDay')} value={startDay} onChange={setStartDay} options={[{ value: '0', label: t('cal.sunday') }, { value: '1', label: t('cal.monday') }]} />
      {ok ? null : <p className="field-hint">{t('cal.yearBad')}</p>}
    </DocShell>
  );
}
