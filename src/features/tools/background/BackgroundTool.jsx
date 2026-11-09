// Page Background screen: pick a soft colour that is painted behind every page.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';
import { BACKGROUNDS } from './addBackground.js';

export default function BackgroundTool({ tool }) {
  const { t } = useI18n();
  const [colour, setColour] = usePref('background.colour', 'cream');
  const prepare = () => ({ task: 'background', payload: { name: colour } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-colour">
      <ChoiceGroup chips legend={t('background.colour')} value={colour} onChange={setColour} options={Object.keys(BACKGROUNDS).map((v) => ({ value: v, label: t(`background.${v}`) }))} />
      <p className="field-hint">{t('background.note')}</p>
    </SimplePdfTool>
  );
}
