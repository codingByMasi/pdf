// Scan Pack screen: add photos or scans, put them in order, choose the page size and the margin, make one PDF.
import { usePref } from '../../../shared/lib/usePref.js';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { prepareImage } from '../jpgToPdf/prepareImage.js';

const MARGINS = { none: 0, small: 14, medium: 28, large: 56 };

export default function ScanPackTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [pageMode, setPageMode] = usePref('scanpack.page', 'a4');
  const [margin, setMargin] = usePref('scanpack.margin', 'small');
  const { items } = selection;

  function run() {
    job.run(async (onProgress) => {
      const images = [];
      for (const item of items) images.push(await prepareImage(item.file));
      const bytes = await runTask('imagesToPdf', { images, pageMode, margin: MARGINS[margin] }, { onProgress });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: 'scans.pdf' };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} reorderable action={{ labelKey: 'run.scanPack', enabled: items.length > 0, onRun: run }}>
      <ChoiceGroup
        legend={t('jpgToPdf.pageLabel')}
        value={pageMode}
        onChange={setPageMode}
        options={[
          { value: 'a4', label: t('scanpack.a4') },
          { value: 'letter', label: t('scanpack.letter') },
          { value: 'fit', label: t('jpgToPdf.fit') },
        ]}
      />
      <ChoiceGroup legend={t('scanpack.margin')} value={margin} onChange={setMargin} options={Object.keys(MARGINS).map((v) => ({ value: v, label: t(`scanpack.m.${v}`) }))} />
    </ToolWorkspace>
  );
}
