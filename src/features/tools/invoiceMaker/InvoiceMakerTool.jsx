// Invoice Maker screen: fill in seller, buyer and items, then download a PDF invoice with GST sums.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { todayText } from '../calcKit/dates.js';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { ListEditor } from '../docKit/ListEditor.jsx';
import { tFor } from '../docKit/tFor.js';
import { invoicePdf } from './invoicePdf.js';

const BLANK = { desc: '', qty: '1', rate: '' };

export default function InvoiceMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const [f, setF] = useState({ seller: '', sellerAddress: '', sellerTax: '', buyer: '', buyerAddress: '', buyerTax: '', number: '1', date: todayText(), notes: '' });
  const [gst, setGst] = usePref('invoice.gst', '0');
  const [items, setItems] = useState([{ ...BLANK }]);
  const set = (k) => (e) => setF((now) => ({ ...now, [k]: e.target.value }));
  const field = (k, label, extra = {}) => <TextField label={label} value={f[k]} onChange={set(k)} {...extra} />;
  const make = async () => {
    const out = await invoicePdf({ ...f, items, gst, accent: style.accent }, await tFor(style.docLang));
    return { ...out, fileName: `invoice-${(f.number || '1').replace(/[^\w-]+/g, '') || '1'}.pdf` };
  };
  const ready = f.seller.trim() && f.buyer.trim() && items.some((i) => i.desc.trim() && Number(i.rate) > 0);
  return (
    <DocShell toolId="invoiceMaker" make={make} canRun={Boolean(ready)}>
      {style.controls}
      <h3>{t('invoice.you')}</h3>
      <div className="form-fields">{field('seller', t('invoice.seller'))}{field('sellerTax', t('invoice.taxIdLabel'))}</div>
      {field('sellerAddress', t('invoice.address'), { multiline: true })}
      <h3>{t('invoice.customer')}</h3>
      <div className="form-fields">{field('buyer', t('invoice.buyer'))}{field('buyerTax', t('invoice.taxIdLabel'))}</div>
      {field('buyerAddress', t('invoice.address'), { multiline: true })}
      <div className="form-fields">{field('number', t('invoice.numberLabel'))}{field('date', t('invoice.dateLabel'), { type: 'date' })}</div>
      <ListEditor legend={t('invoice.items')} itemLabel={t('invoice.item')} items={items} onChange={setItems} blank={BLANK} max={40}
        fields={[{ key: 'desc', label: t('invoice.col.desc') }, { key: 'qty', label: t('invoice.col.qty'), type: 'number', inputMode: 'decimal' }, { key: 'rate', label: t('invoice.col.rate'), type: 'number', inputMode: 'decimal' }]} />
      <TextField label={t('invoice.gstRate')} type="number" inputMode="decimal" min="0" max="100" value={gst} onChange={(e) => setGst(e.target.value)} hint={t('invoice.gstHint')} />
      {field('notes', t('invoice.notes'), { multiline: true })}
    </DocShell>
  );
}
