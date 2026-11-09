// Booklet screen: reorders pages two to a sheet so printed sheets can be folded into a booklet.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function BookletTool({ tool }) {
  const { t } = useI18n();
  const [paper, setPaper] = usePref('paper', 'a4');
  const prepare = () => ({ task: 'booklet', payload: { paper } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-booklet">
      <ChoiceGroup legend={t('paper.label')} value={paper} onChange={setPaper} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
      <p className="field-hint">{t('booklet.note')}</p>
    </SimplePdfTool>
  );
}
