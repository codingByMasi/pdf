// PDF Info screen: see and change title, author and other file info, or remove all of it.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';
import { FIELDS, readInfo } from './pdfInfo.js';

function InfoFields({ file, values, setValues, clearAll, setClearAll }) {
  const { t } = useI18n();
  useEffect(() => {
    let cancelled = false;
    if (!file) return undefined;
    file.arrayBuffer().then((buffer) => readInfo(new Uint8Array(buffer))).then((found) => { if (!cancelled) setValues(found); }).catch(() => {});
    return () => { cancelled = true; };
  }, [file, setValues]);
  return (
    <>
      {FIELDS.map((field) => (
        <TextField key={field} label={t(`info.${field}`)} value={values[field] ?? ''} disabled={clearAll} onChange={(e) => setValues({ ...values, [field]: e.target.value })} />
      ))}
      <label className="choice">
        <input type="checkbox" checked={clearAll} onChange={(e) => setClearAll(e.target.checked)} />
        <span>{t('info.clearAll')}</span>
      </label>
    </>
  );
}

export default function PdfInfoTool({ tool }) {
  const [values, setValues] = useState({});
  const [clearAll, setClearAll] = useState(false);
  const prepare = () => ({ task: 'writeInfo', payload: { values, clearAll } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-info">
      {(info, file) => <InfoFields file={file} values={values} setValues={setValues} clearAll={clearAll} setClearAll={setClearAll} />}
    </SimplePdfTool>
  );
}
