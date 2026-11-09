// Margins and Borders screen: white margin round pages, an optional frame, and blank pages in between.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function PageBordersTool({ tool }) {
  const { t } = useI18n();
  const [margin, setMargin] = usePref('borders.margin', '10');
  const [frame, setFrame] = usePref('borders.frame', 'thin');
  const [blank, setBlank] = usePref('borders.blank', 'none');
  const prepare = () => ({ task: 'pageBorders', payload: { options: { marginMm: Number(margin), frame, blank } } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-framed">
      <ChoiceGroup legend={t('borders.margin')} value={margin} onChange={setMargin} options={['0', '10', '20', '30'].map((v) => ({ value: v, label: `${v} mm` }))} />
      <ChoiceGroup legend={t('borders.frame')} value={frame} onChange={setFrame} options={['none', 'thin', 'thick'].map((v) => ({ value: v, label: t(`borders.frame.${v}`) }))} />
      <ChoiceGroup legend={t('borders.blank')} value={blank} onChange={setBlank} options={['none', 'each', 'end'].map((v) => ({ value: v, label: t(`borders.blank.${v}`) }))} />
      <p className="field-hint">{t('borders.note')}</p>
    </SimplePdfTool>
  );
}
