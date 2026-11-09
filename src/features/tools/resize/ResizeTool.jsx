// Resize Pages screen: fit every page onto A4 or Letter paper.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function ResizeTool({ tool }) {
  const { t } = useI18n();
  const [paper, setPaper] = useState('a4');
  const prepare = () => ({ task: 'resizePages', payload: { paper } });
  const note = (r) => ({ noteKey: r.turned > 0 ? 'resize.turned' : 'resize.links', noteVars: { count: r.turned } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix={`-${paper}`} note={note}>
      <ChoiceGroup legend={t('paper.label')} value={paper} onChange={setPaper} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
      <p>{t('resize.warning')}</p>
    </SimplePdfTool>
  );
}
