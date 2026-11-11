// Currency Converter screen: you type the rate yourself (no internet is used), so it is always your own number.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { convertAmount } from './convertAmount.js';

export default function CurrencyConvTool() {
  const { t } = useI18n();
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const r = useMemo(() => (amount && rate ? convertAmount(amount, rate) : null), [amount, rate]);
  const swap = () => { setFrom(to); setTo(from); if (Number(rate) > 0) setRate(String(+(1 / Number(rate)).toPrecision(8))); };
  return (
    <TextToolShell>
      <p className="field-hint">{t('fx.hint')}</p>
      <div className="form-fields">
        <TextField label={t('fx.from')} value={from} maxLength={6} onChange={(e) => setFrom(e.target.value.toUpperCase())} />
        <TextField label={t('fx.to')} value={to} maxLength={6} onChange={(e) => setTo(e.target.value.toUpperCase())} />
        <TextField label={t('fx.amount', { from })} type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <TextField label={t('fx.rate', { from, to })} type="number" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
      </div>
      <button type="button" className="button button-secondary" onClick={swap}>{t('fx.swap')}</button>
      {r?.ok ? <ResultGrid items={[{ label: t('fx.result', { to }), value: r.text }, { label: t('fx.backRate', { to, from }), value: r.back }]} /> : r ? <p role="alert">{t('fx.bad')}</p> : null}
    </TextToolShell>
  );
}
