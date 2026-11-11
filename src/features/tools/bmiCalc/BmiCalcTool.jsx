// BMI Calculator screen: height and weight in metric or imperial units, with the adult group in plain words.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { calcBmi } from './calcBmi.js';

export default function BmiCalcTool() {
  const { t } = useI18n();
  const [unit, setUnit] = usePref('bmi.unit', 'metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const r = useMemo(() => (height && weight ? calcBmi({ height, weight, unit }) : null), [height, weight, unit]);
  const kg = (v) => (unit === 'imperial' ? `${(v / 0.45359237).toFixed(0)} lb` : `${v.toFixed(1)} kg`);
  return (
    <TextToolShell>
      <ChoiceGroup legend={t('bmi.unit')} value={unit} onChange={setUnit} options={[{ value: 'metric', label: t('bmi.metric') }, { value: 'imperial', label: t('bmi.imperial') }]} />
      <div className="form-fields">
        <TextField label={t(unit === 'metric' ? 'bmi.heightCm' : 'bmi.heightIn')} type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
        <TextField label={t(unit === 'metric' ? 'bmi.weightKg' : 'bmi.weightLb')} type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      {r && !r.ok ? <StatusMessage title={t('error.heading')}>{t(r.errorKey ?? 'bmi.bad')}</StatusMessage> : null}
      {r?.ok ? (
        <>
          <ResultGrid items={[{ label: t('bmi.result'), value: r.bmi.toFixed(1) }, { label: t('bmi.group'), value: t(`bmi.g.${r.group}`) }, { label: t('bmi.healthy'), value: `${kg(r.healthyLow)} – ${kg(r.healthyHigh)}` }]} />
          <p className="field-hint">{t('bmi.note')}</p>
        </>
      ) : null}
    </TextToolShell>
  );
}
