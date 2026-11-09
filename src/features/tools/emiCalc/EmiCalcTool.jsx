// EMI Calculator screen: monthly loan payment, total interest and a year-by-year table.
import { useMemo } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { rupees } from '../calcKit/formatMoney.js';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { calcEmi } from './calcEmi.js';

export default function EmiCalcTool() {
  const { t } = useI18n();
  const [amount, setAmount] = usePref('emi.amount', '1000000');
  const [rate, setRate] = usePref('emi.rate', '9');
  const [tenure, setTenure] = usePref('emi.tenure', '10');
  const [unit, setUnit] = usePref('emi.unit', 'years');
  const r = useMemo(() => calcEmi(Number(amount), Number(rate), Number(tenure) * (unit === 'years' ? 12 : 1)), [amount, rate, tenure, unit]);
  return (
    <TextToolShell>
      <div className="form-fields">
        <TextField label={t('emi.amount')} type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <TextField label={t('emi.rate')} type="number" inputMode="decimal" min="0" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} />
        <TextField label={t('emi.tenure')} type="number" inputMode="numeric" min="1" value={tenure} onChange={(e) => setTenure(e.target.value)} />
      </div>
      <ChoiceGroup chips legend={t('emi.unit')} value={unit} onChange={setUnit} options={[{ value: 'years', label: t('emi.years') }, { value: 'months', label: t('emi.months') }]} />
      {r.ok ? (
        <>
          <ResultGrid items={[{ label: t('emi.emi'), value: rupees(r.emi) }, { label: t('emi.interest'), value: rupees(r.interest) }, { label: t('emi.total'), value: rupees(r.total) }]} />
          <div className="data-table" tabIndex={0} role="region" aria-label={t('emi.table')}>
            <table>
              <thead><tr><th>{t('emi.year')}</th><th>{t('emi.paidPrincipal')}</th><th>{t('emi.paidInterest')}</th><th>{t('emi.left')}</th></tr></thead>
              <tbody>{r.years.map((y) => <tr key={y.year}><td>{y.year}</td><td>{rupees(y.principal)}</td><td>{rupees(y.interest)}</td><td>{rupees(y.balance)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : <StatusMessage title={t('error.heading')}>{t(r.errorKey)}</StatusMessage>}
    </TextToolShell>
  );
}
