// Certificate Maker screen: a plain certificate of appreciation, participation, achievement or completion.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { todayText } from '../calcKit/dates.js';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { tFor } from '../docKit/tFor.js';
import { KINDS, certificatePdf } from './certificatePdf.js';

export default function CertificateMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const [kind, setKind] = usePref('cert.kind', 'appreciation');
  const [f, setF] = useState({ title: '', name: '', reason: '', org: '', date: todayText(), signer: '', signerTitle: '' });
  const set = (k) => (e) => setF((now) => ({ ...now, [k]: e.target.value }));
  const field = (k, label, extra = {}) => <TextField label={label} value={f[k]} onChange={set(k)} {...extra} />;
  const make = async () => ({ ...(await certificatePdf({ ...f, kind, accent: style.accent }, tFor(style.docLang))), fileName: 'certificate.pdf' });
  return (
    <DocShell toolId="certificateMaker" make={make} canRun={f.name.trim() !== ''}>
      {style.controls}
      <ChoiceGroup chips legend={t('cert.kindLabel')} value={kind} onChange={setKind} options={KINDS.map((v) => ({ value: v, label: t(`cert.kind.${v}`) }))} />
      {field('title', t('cert.title'), { hint: t('cert.titleHint') })}
      {field('name', t('cert.name'))}
      {field('reason', t('cert.reason'), { multiline: true, hint: t('cert.reasonHint') })}
      <div className="form-fields">{field('org', t('cert.org'))}{field('date', t('cert.date'))}</div>
      <div className="form-fields">{field('signer', t('cert.signer'))}{field('signerTitle', t('cert.signerTitle'))}</div>
      <p className="field-hint">{t('cert.hint')}</p>
    </DocShell>
  );
}
