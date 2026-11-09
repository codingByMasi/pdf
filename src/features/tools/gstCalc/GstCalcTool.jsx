// GST Calculator screen: add GST to a price or take it out, with the CGST and SGST split.
import { useMemo } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { rupees } from '../calcKit/formatMoney.js';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { RATES, calcGst } from './calcGst.js';

export default function GstCalcTool() {
  const { t } = useI18n();
  const [amount, setAmount] = usePref('gst.amount', '1000');
  const [rate, setRate] = usePref('gst.rate', '18');
  const [mode, setMode] = usePref('gst.mode', 'add');
  const r = useMemo(() => (amount === '' ? null : calcGst(Number(amount), Number(rate), mode)), [amount, rate, mode]);
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('gst.mode')} value={mode} onChange={setMode} options={[{ value: 'add', label: t('gst.add') }, { value: 'remove', label: t('gst.remove') }]} />
      <TextField label={mode === 'add' ? t('gst.amountExcl') : t('gst.amountIncl')} type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <ChoiceGroup chips legend={t('gst.rate')} value={RATES.map(String).includes(rate) ? rate : ''} onChange={setRate} options={RATES.map((v) => ({ value: String(v), label: `${v}%` }))} />
      <TextField label={t('gst.other')} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
      {r && !r.ok ? <StatusMessage title={t('error.heading')}>{t(r.errorKey)}</StatusMessage> : null}
      {r?.ok ? <ResultGrid items={[{ label: t('gst.base'), value: rupees(r.base) }, { label: t('gst.gst'), value: rupees(r.gst) }, { label: 'CGST', value: rupees(r.cgst) }, { label: 'SGST', value: rupees(r.sgst) }, { label: t('gst.total'), value: rupees(r.total) }]} /> : null}
    </TextToolShell>
  );
}
