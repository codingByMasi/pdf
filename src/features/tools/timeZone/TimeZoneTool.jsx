// Time Zone Converter screen: pick a date and time in one place and see it in other places.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { ZONES, formatInZone, formatOffset, offsetMinutes, zonedToInstant } from './zoneTime.js';

const pad = (n) => String(n).padStart(2, '0');
const now = () => { const d = new Date(); return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }; };

function Zone({ id, label, value, onChange }) {
  const { t } = useI18n();
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="zone-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {ZONES.map((z) => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}
      </select>
      <span className="visually-hidden">{t('tz.zone')}</span>
    </label>
  );
}

export default function TimeZoneTool() {
  const { t, lang } = useI18n();
  const [from, setFrom] = usePref('tz.from', 'Asia/Kolkata');
  const [to, setTo] = usePref('tz.to', 'America/New_York');
  const start = useMemo(now, []);
  const [date, setDate] = useState(start.date);
  const [time, setTime] = useState(start.time);
  const locale = lang === 'hi' ? 'hi-IN' : 'en-GB';
  const result = useMemo(() => {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
    const ms = zonedToInstant({ year, month, day, hour, minute }, from);
    return { here: formatInZone(ms, from, locale), there: formatInZone(ms, to, locale), a: formatOffset(offsetMinutes(ms, from)), b: formatOffset(offsetMinutes(ms, to)) };
  }, [date, time, from, to, locale]);
  return (
    <TextToolShell>
      <div className="form-fields">
        <TextField label={t('tz.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField label={t('tz.time')} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <Zone id="from" label={t('tz.from')} value={from} onChange={setFrom} />
        <Zone id="to" label={t('tz.to')} value={to} onChange={setTo} />
      </div>
      {result ? <ResultGrid items={[{ label: `${from.replace('_', ' ')} (${result.a})`, value: result.here }, { label: `${to.replace('_', ' ')} (${result.b})`, value: result.there }]} /> : null}
      <p className="field-hint">{t('tz.note')}</p>
    </TextToolShell>
  );
}
