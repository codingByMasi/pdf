// JPG to PDF screen: add photos, put them in order, choose the page size, make a PDF.
import { usePref } from '../../../shared/lib/usePref.js';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { prepareImage } from './prepareImage.js';

export default function JpgToPdfTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [pageMode, setPageMode] = usePref('jpg.pageMode', 'fit');
  const { items } = selection;

  function run() {
    job.run(async (onProgress) => {
      const images = [];
      for (const item of items) images.push(await prepareImage(item.file));
      const bytes = await runTask('imagesToPdf', { images, pageMode }, { onProgress });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: 'images.pdf' };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      reorderable
      action={{ labelKey: 'run.jpgToPdf', enabled: items.length > 0, onRun: run }}
    >
      <ChoiceGroup
        legend={t('jpgToPdf.pageLabel')}
        value={pageMode}
        onChange={setPageMode}
        options={[
          { value: 'fit', label: t('jpgToPdf.fit') },
          { value: 'a4', label: t('jpgToPdf.a4') },
        ]}
      />
    </ToolWorkspace>
  );
}
