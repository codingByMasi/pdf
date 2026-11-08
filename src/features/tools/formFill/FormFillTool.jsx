// Form Filler screen: lists the fill-in fields of a PDF, lets you type in them, and saves the filled PDF.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { friendlyErrorKey } from '../../../shared/lib/friendlyError.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { readFormFields } from './formFields.js';

function FieldControl({ field, value, onChange }) {
  const { t } = useI18n();
  const label = field.page >= 0 ? `${field.name} (${t('viewer.pageShort', { page: field.page + 1 })})` : field.name;
  if (field.type === 'check') {
    return (
      <label className="choice">
        <input type="checkbox" checked={Boolean(value)} disabled={field.readOnly} onChange={(event) => onChange(event.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }
  if (field.type === 'radio') {
    return (
      <ChoiceGroup legend={label} value={value} onChange={onChange} options={field.options.map((option) => ({ value: option, label: option }))} />
    );
  }
  if (field.type === 'choice') {
    return (
      <label className="field">
        <span className="field-label">{label}</span>
        <select className="field-input" value={value} disabled={field.readOnly} onChange={(event) => onChange(event.target.value)}>
          <option value="">{t('form.noChoice')}</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }
  return <TextField label={label} multiline={field.multiline} disabled={field.readOnly} value={value} onChange={(event) => onChange(event.target.value)} />;
}

export default function FormFillTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const [form, setForm] = useState({ status: 'idle', fields: [], errorKey: '' });
  const [values, setValues] = useState({});
  const [flatten, setFlatten] = useState(false);

  useEffect(() => {
    setValues({});
    if (!file) {
      setForm({ status: 'idle', fields: [], errorKey: '' });
      return undefined;
    }
    let cancelled = false;
    setForm({ status: 'loading', fields: [], errorKey: '' });
    file.arrayBuffer()
      .then((buffer) => readFormFields(new Uint8Array(buffer)))
      .then((fields) => {
        if (cancelled) return;
        setValues(Object.fromEntries(fields.map((f) => [f.name, f.value])));
        setForm({ status: 'ready', fields, errorKey: fields.length ? '' : 'form.noFields' });
      })
      .catch((error) => !cancelled && setForm({ status: 'error', fields: [], errorKey: error?.errorKey ?? friendlyErrorKey(error) }));
    return () => { cancelled = true; };
  }, [file]);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await runTask('fillForm', { bytes, values, flatten }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-filled') };
    });
  }

  const ready = form.status === 'ready' && form.fields.length > 0;
  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: form.errorKey }}
      hasFiles={ready}
      action={{ labelKey: 'run.formFill', enabled: ready, onRun: run }}
    >
      <StatusMessage kind="info">{t('form.note')}</StatusMessage>
      <div className="form-fields">
        {form.fields.map((field) => (
          <FieldControl key={field.name} field={field} value={values[field.name]} onChange={(value) => setValues((now) => ({ ...now, [field.name]: value }))} />
        ))}
      </div>
      <label className="choice">
        <input type="checkbox" checked={flatten} onChange={(event) => setFlatten(event.target.checked)} />
        <span>{t('form.flatten')}</span>
      </label>
    </ToolWorkspace>
  );
}
