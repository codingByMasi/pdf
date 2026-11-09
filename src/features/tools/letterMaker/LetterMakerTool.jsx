// Letter Maker screen: pick a ready letter (leave, resignation, complaint), fill the blanks, download a PDF in English or Hindi.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { todayText } from '../calcKit/dates.js';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { tFor } from '../docKit/tFor.js';
import { TEMPLATES, letterPdf } from './letterPdf.js';

const dmy = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('-') : iso);

export default function LetterMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const [template, setTemplate] = usePref('letter.template', 'leaveOffice');
  const [f, setF] = useState({ name: '', address: '', date: todayText(), to: '', f1: '', f2: '', f3: '' });
  const set = (k) => (e) => setF((now) => ({ ...now, [k]: e.target.value }));
  const make = async () => ({ ...(await letterPdf({ ...f, template, date: dmy(f.date) }, await tFor(style.docLang))), fileName: 'letter.pdf' });
  return (
    <DocShell toolId="letterMaker" make={make} canRun={f.name.trim() !== '' && f.to.trim() !== ''}>
      {style.controls}
      <ChoiceGroup legend={t('letter.which')} value={template} onChange={setTemplate} options={TEMPLATES.map((v) => ({ value: v, label: t(`letter.${v}.name`) }))} />
      <div className="form-fields">
        <TextField label={t('letter.yourName')} value={f.name} onChange={set('name')} />
        <TextField label={t('letter.date')} type="date" value={f.date} onChange={set('date')} />
      </div>
      <TextField label={t('letter.yourAddress')} multiline value={f.address} onChange={set('address')} />
      <TextField label={t('letter.toLabel')} multiline value={f.to} onChange={set('to')} hint={t('letter.toHint')} />
      {['f1', 'f2', 'f3'].map((k) => <TextField key={`${template}${k}`} label={t(`letter.${template}.${k}`)} value={f[k]} onChange={set(k)} multiline={k === 'f3'} />)}
      <p className="field-hint">{t('letter.hint')}</p>
    </DocShell>
  );
}
