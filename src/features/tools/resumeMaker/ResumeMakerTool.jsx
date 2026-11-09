// Resume Maker screen: fill in your details, jobs and schools, then download a plain, clean PDF resume.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { ListEditor } from '../docKit/ListEditor.jsx';
import { tFor } from '../docKit/tFor.js';
import { resumePdf } from './resumePdf.js';

const JOB = { role: '', company: '', period: '', details: '' };
const SCHOOL = { degree: '', school: '', period: '' };

export default function ResumeMakerTool() {
  const { t } = useI18n();
  const style = useDocStyle();
  const [f, setF] = useState({ name: '', title: '', phone: '', email: '', address: '', summary: '', skills: '', extras: '' });
  const [experience, setExperience] = useState([{ ...JOB }]);
  const [education, setEducation] = useState([{ ...SCHOOL }]);
  const set = (k) => (e) => setF((now) => ({ ...now, [k]: e.target.value }));
  const field = (k, label, extra = {}) => <TextField label={label} value={f[k]} onChange={set(k)} {...extra} />;
  const make = async () => ({ ...(await resumePdf({ ...f, experience, education, accent: style.accent }, tFor(style.docLang))), fileName: 'resume.pdf' });
  return (
    <DocShell toolId="resumeMaker" make={make} canRun={f.name.trim() !== ''}>
      {style.controls}
      <div className="form-fields">{field('name', t('resume.name'))}{field('title', t('resume.jobTitle'))}</div>
      <div className="form-fields">{field('phone', t('resume.phone'), { type: 'tel' })}{field('email', t('resume.email'), { type: 'email' })}</div>
      {field('address', t('resume.address'))}
      {field('summary', t('resume.summary'), { multiline: true, hint: t('resume.summaryHint') })}
      <ListEditor legend={t('resume.experience')} itemLabel={t('resume.job')} items={experience} onChange={setExperience} blank={JOB} max={12}
        fields={[{ key: 'role', label: t('resume.role') }, { key: 'company', label: t('resume.company') }, { key: 'period', label: t('resume.period') }, { key: 'details', label: t('resume.details'), multiline: true }]} />
      <ListEditor legend={t('resume.education')} itemLabel={t('resume.school')} items={education} onChange={setEducation} blank={SCHOOL} max={8}
        fields={[{ key: 'degree', label: t('resume.degree') }, { key: 'school', label: t('resume.schoolName') }, { key: 'period', label: t('resume.period') }]} />
      {field('skills', t('resume.skills'), { multiline: true, hint: t('resume.skillsHint') })}
      {field('extras', t('resume.extras'), { multiline: true, hint: t('resume.extrasHint') })}
    </DocShell>
  );
}
