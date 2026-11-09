// Editor for a repeated group of fields (invoice items, jobs, schools): add, change and remove rows.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';

// fields: [{ key, label, multiline?, type?, inputMode? }]. blank: the new empty row.
export function ListEditor({ legend, itemLabel, items, fields, blank, onChange, max = 20 }) {
  const { t } = useI18n();
  const change = (index, key, value) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  return (
    <div className="list-editor">
      <h3>{legend}</h3>
      {items.map((item, index) => (
        <fieldset key={index} className="list-item">
          <legend className="field-label">{itemLabel} {index + 1}</legend>
          <div className="form-fields">
            {fields.map((f) => (
              <TextField key={f.key} label={f.label} type={f.type} inputMode={f.inputMode} multiline={f.multiline} rows={f.multiline ? 3 : undefined} value={item[f.key] ?? ''} onChange={(e) => change(index, f.key, e.target.value)} />
            ))}
          </div>
          {items.length > 1 ? <Button variant="secondary" onClick={() => onChange(items.filter((_, i) => i !== index))}>{t('doc.remove')}</Button> : null}
        </fieldset>
      ))}
      {items.length < max ? <Button variant="secondary" onClick={() => onChange([...items, { ...blank }])}>{t('doc.add')}</Button> : null}
    </div>
  );
}
