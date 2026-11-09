// Pages per Sheet screen: 2 or 4 pages on each sheet of A4 or Letter paper, for printing.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function NUpTool({ tool }) {
  const { t } = useI18n();
  const [perSheet, setPerSheet] = useState('2');
  const [paper, setPaper] = useState('a4');
  const prepare = () => ({ task: 'nUp', payload: { perSheet: Number(perSheet), paper } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-sheets">
      <ChoiceGroup legend={t('nup.perSheet')} value={perSheet} onChange={setPerSheet} options={[{ value: '2', label: t('nup.two') }, { value: '4', label: t('nup.four') }]} />
      <ChoiceGroup legend={t('paper.label')} value={paper} onChange={setPaper} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
    </SimplePdfTool>
  );
}
