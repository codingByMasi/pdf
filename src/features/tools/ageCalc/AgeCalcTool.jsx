// Age Calculator screen: shows exact age and the next birthday from a birth date.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { formatDate, todayText } from '../calcKit/dates.js';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { calcAge } from './calcAge.js';

export default function AgeCalcTool() {
  const { t } = useI18n();
  const [birth, setBirth] = useState('');
  const [asOf, setAsOf] = useState(todayText);
  const r = useMemo(() => (birth ? calcAge(birth, asOf) : null), [birth, asOf]);
  return (
    <TextToolShell>
      <div className="form-fields">
        <TextField label={t('age.birth')} type="date" value={birth} onChange={(e) => setBirth(e.target.value)} hint={t('calc.dateHint')} />
        <TextField label={t('age.asOf')} type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
      </div>
      {r && !r.ok ? <StatusMessage title={t('error.heading')}>{t(r.errorKey)}</StatusMessage> : null}
      {r?.ok ? (
        <>
          <ResultGrid items={[
            { label: t('age.age'), value: t('age.ymd', { years: r.years, months: r.months, days: r.days }) },
            { label: t('age.months'), value: r.totalMonths },
            { label: t('age.weeks'), value: r.totalWeeks },
            { label: t('age.days'), value: r.totalDays },
            { label: t('age.weekday'), value: t(`weekday.${r.birthWeekday}`) },
            { label: t('age.next'), value: t('age.nextText', { days: r.daysToBirthday, date: formatDate(r.nextBirthday), turning: r.turning }) },
          ]} />
        </>
      ) : null}
    </TextToolShell>
  );
}
