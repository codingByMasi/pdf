// Unit Converter screen: length, weight, area, volume, speed, data and temperature.
import { useId, useMemo } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { GROUPS, convertUnit, niceNumber } from './units.js';

function UnitSelect({ label, value, onChange, group }) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <select id={id} className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.keys(GROUPS[group]).map((u) => <option key={u} value={u}>{t(`unit.${u}`)}</option>)}
      </select>
    </div>
  );
}

export default function UnitConvertTool() {
  const { t } = useI18n();
  const [group, setGroup] = usePref('unit.group', 'length');
  const [value, setValue] = usePref('unit.value', '1');
  const [pair, setPair] = usePref('unit.pair', '');
  const units = Object.keys(GROUPS[group]);
  const [from, to] = (pair.split('|').length === 3 && pair.startsWith(`${group}|`) ? pair.split('|').slice(1) : [units[0], units[1]]);
  const choose = (f, tt) => setPair(`${group}|${f}|${tt}`);
  const out = useMemo(() => convertUnit(group, from, to, value), [group, from, to, value]);
  const all = useMemo(() => units.map((u) => ({ label: t(`unit.${u}`), value: niceNumber(convertUnit(group, from, u, value)) })), [group, from, value, units, t]);
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('unit.group')} value={group} onChange={setGroup} options={Object.keys(GROUPS).map((v) => ({ value: v, label: t(`unit.g.${v}`) }))} />
      <TextField label={t('unit.value')} type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="form-fields">
        <UnitSelect label={t('unit.from')} value={from} group={group} onChange={(u) => choose(u, to)} />
        <UnitSelect label={t('unit.to')} value={to} group={group} onChange={(u) => choose(from, u)} />
      </div>
      <Button variant="secondary" onClick={() => choose(to, from)}>{t('unit.swap')}</Button>
      {out !== null ? <ResultGrid items={[{ label: `${niceNumber(Number(value))} ${t(`unit.${from}`)} =`, value: `${niceNumber(out)} ${t(`unit.${to}`)}` }]} /> : null}
      {out !== null ? <><h3>{t('unit.all')}</h3><ResultGrid items={all} /></> : null}
    </TextToolShell>
  );
}
