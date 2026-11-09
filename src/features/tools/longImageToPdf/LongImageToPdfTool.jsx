// Long Image to PDF screen: a tall screenshot is cut into pages so nothing becomes tiny.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { prepareImage } from '../jpgToPdf/prepareImage.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { sliceImage } from './sliceImage.js';

export default function LongImageToPdfTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const { bytes, type } = await prepareImage(file);
      const images = await sliceImage(bytes, type === 'png' ? 'image/png' : 'image/jpeg');
      const data = await runTask('imagesToPdf', { images, pageMode: 'a4' }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '') };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: 'run.longImageToPdf', enabled: Boolean(file), onRun: run }}>
      <p>{t('longImage.hint')}</p>
    </ToolWorkspace>
  );
}
