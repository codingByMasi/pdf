// Passport Photo Sheet screen: add one photo, pick the photo size and paper, and get a print-ready PDF with many copies.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { cropPhoto } from './cropPhoto.js';
import { PHOTO_SIZES } from './photoLayout.js';

export default function PhotoSheetTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [size, setSize] = usePref('photo.size', '35x45');
  const [sheet, setSheet] = usePref('photo.sheet', '4x6');
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      onProgress(20);
      const photo = await cropPhoto(file, PHOTO_SIZES[size]);
      const result = await runTask('photoSheet', { photo, size, sheet }, { onProgress });
      return { blob: new Blob([result.bytes], { type: 'application/pdf' }), fileName: `photos-${size}.pdf`, noteKey: 'photo.done', noteVars: { count: result.count } };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: 'run.photoSheet', enabled: Boolean(file), onRun: run }}>
      <ChoiceGroup legend={t('photo.size')} value={size} onChange={setSize} options={Object.keys(PHOTO_SIZES).map((v) => ({ value: v, label: t(`photo.size.${v}`) }))} />
      <ChoiceGroup legend={t('photo.sheet')} value={sheet} onChange={setSheet} options={[{ value: '4x6', label: '4 × 6 inch' }, { value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]} />
      <StatusMessage kind="info">{t('photo.note')}</StatusMessage>
    </ToolWorkspace>
  );
}
