// Split by Size screen: type a size limit in megabytes and get a zip of parts under that size.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function SplitSizeTool({ tool }) {
  const { t } = useI18n();
  const [mb, setMb] = useState('5');
  const size = Number(mb);
  const ok = Number.isFinite(size) && size >= 0.05 && size <= 500;

  const prepare = () => ({ task: 'splitBySize', payload: { maxBytes: Math.round(size * 1024 * 1024) } });
  const note = (result) => (result.tooBig > 0 ? { noteKey: 'splitSize.tooBig', noteVars: { count: result.tooBig } } : { noteKey: 'splitSize.parts', noteVars: { count: result.parts } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-parts" ext="zip" mime="application/zip" note={note} canRun={ok}>
      <TextField label={t('splitSize.label')} hint={t('splitSize.hint')} type="number" inputMode="decimal" min="0.05" max="500" step="any" value={mb} onChange={(e) => setMb(e.target.value)} />
      {ok ? null : <p role="alert">{t('splitSize.bad')}</p>}
    </SimplePdfTool>
  );
}
