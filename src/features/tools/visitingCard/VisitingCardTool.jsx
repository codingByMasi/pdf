// Visiting Card Maker screen: fill in your details and download a sheet of ten cards (or one card) as a PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { cardPdf } from './cardPdf.js';

export default function VisitingCardTool() {
  const { t } = useI18n();
  const style = useDocStyle(false);
  const [sheet, setSheet] = usePref('card.sheet', 'sheet');
  const [f, setF] = useState({ name: '', title: '', company: '', phone: '', email: '', website: '', address: '' });
  const set = (k) => (e) => setF((now) => ({ ...now, [k]: e.target.value }));
  const field = (k, label, extra = {}) => <TextField label={label} value={f[k]} onChange={set(k)} {...extra} />;
  const make = async () => ({ ...(await cardPdf({ ...f, accent: style.accent, sheet })), fileName: 'visiting-cards.pdf' });
  return (
    <DocShell toolId="visitingCard" make={make} canRun={f.name.trim() !== ''}>
      {style.controls}
      <ChoiceGroup chips legend={t('card.sheet')} value={sheet} onChange={setSheet} options={[{ value: 'sheet', label: t('card.ten') }, { value: 'one', label: t('card.one') }]} />
      <div className="form-fields">{field('name', t('card.name'))}{field('title', t('card.jobTitle'))}</div>
      {field('company', t('card.company'))}
      <div className="form-fields">{field('phone', t('card.phone'), { type: 'tel' })}{field('email', t('card.email'), { type: 'email' })}</div>
      {field('website', t('card.website'))}
      {field('address', t('card.address'), { multiline: true })}
      <p className="field-hint">{t('card.hint')}</p>
    </DocShell>
  );
}
