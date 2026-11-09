// Attach Files screen: add a PDF, then choose other files to hide inside it as attachments.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

const MAX_TOTAL = 50 * 1024 * 1024;

export default function AttachTool({ tool }) {
  const { t } = useI18n();
  const [files, setFiles] = useState([]);
  const total = files.reduce((sum, f) => sum + f.size, 0);
  const prepare = async () => {
    if (files.length === 0) return { error: { key: 'error.attachNone' } };
    if (total > MAX_TOTAL) return { error: { key: 'error.attachBig' } };
    const list = await Promise.all(files.map(async (f) => ({ name: f.name, type: f.type, bytes: new Uint8Array(await f.arrayBuffer()) })));
    return { task: 'attach', payload: { files: list } };
  };
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-attached" canRun={files.length > 0}>
      <div className="field">
        <label className="field-label" htmlFor="attach-input">{t('attach.choose')}</label>
        <input id="attach-input" className="field-input" type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
        <p className="field-hint">{files.length > 0 ? t('attach.chosen', { count: files.length, size: formatSize(total) }) : t('attach.hint')}</p>
      </div>
    </SimplePdfTool>
  );
}
