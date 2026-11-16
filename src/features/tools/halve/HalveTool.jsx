// Halve Pages screen: cut every page in two, down the middle or across it.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function HalveTool({ tool }) {
  const { t } = useI18n();
  const [cut, setCut] = usePref('halve.cut', 'vertical');
  const prepare = () => ({ task: 'halve', payload: { cut } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-halved">
      <ChoiceGroup legend={t('halve.cut')} value={cut} onChange={setCut} options={[{ value: 'vertical', label: t('halve.vertical') }, { value: 'horizontal', label: t('halve.horizontal') }]} />
    </SimplePdfTool>
  );
}
