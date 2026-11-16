// Poster screen: enlarge each page and cut it into a grid of sheets to print and stick together.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function PosterTool({ tool }) {
  const { t } = useI18n();
  const [grid, setGrid] = usePref('poster.grid', '2');
  const [paper, setPaper] = usePref('paper', 'a4');
  const prepare = (info) => {
    if (info.pageCount * Number(grid) ** 2 > 400) return { error: { key: 'error.tooManyPages' } };
    return { task: 'poster', payload: { grid: Number(grid), paper } };
  };
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-poster">
      <ChoiceGroup legend={t('poster.grid')} value={grid} onChange={setGrid} options={[{ value: '2', label: t('poster.g2') }, { value: '3', label: t('poster.g3') }, { value: '4', label: t('poster.g4') }]} />
      <ChoiceGroup legend={t('paper.label')} value={paper} onChange={setPaper} options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
    </SimplePdfTool>
  );
}
