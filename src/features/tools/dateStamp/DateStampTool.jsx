// Date, time and name stamp screen: type a name, pick the date and time, choose the corner, stamp the pages.
import { useState } from 'react';
import { usePref } from '../../../shared/lib/usePref.js';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

const pad = (n) => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const show = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };

export default function DateStampTool({ tool }) {
  const { t } = useI18n();
  const [name, setName] = usePref('datestamp.name', '');
  const [date, setDate] = useState(today);
  const [useDate, setUseDate] = useState(true);
  const [time, setTime] = useState(nowTime);
  const [useTime, setUseTime] = useState(false);
  const [position, setPosition] = usePref('datestamp.position', 'bottomRight');
  const [which, setWhich] = usePref('datestamp.pages', 'all');
  const options = { name, date: useDate && date ? show(date) : '', time: useTime ? time : '', position, pages: which };
  const prepare = () => ({ task: 'dateStamp', payload: { options } });
  const note = (r) => (r.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: r.replaced } } : null);
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-stamped" note={note} canRun={Boolean(options.name.trim() || options.date || options.time)}>
      <TextField label={t('datestamp.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <label className="choice"><input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} /><span>{t('datestamp.useDate')}</span></label>
      {useDate ? <TextField label={t('datestamp.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} /> : null}
      <label className="choice"><input type="checkbox" checked={useTime} onChange={(e) => setUseTime(e.target.checked)} /><span>{t('datestamp.useTime')}</span></label>
      {useTime ? <TextField label={t('datestamp.time')} type="time" value={time} onChange={(e) => setTime(e.target.value)} /> : null}
      <ChoiceGroup legend={t('datestamp.position')} value={position} onChange={setPosition} options={['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((v) => ({ value: v, label: t(`datestamp.pos.${v}`) }))} />
      <ChoiceGroup legend={t('datestamp.pages')} value={which} onChange={setWhich} options={['all', 'first', 'last'].map((v) => ({ value: v, label: t(`datestamp.pg.${v}`) }))} />
    </SimplePdfTool>
  );
}
