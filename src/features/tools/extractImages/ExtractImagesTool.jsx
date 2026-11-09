// Extract Images screen: saves every picture found inside a PDF as PNG files in one zip.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { extractImages } from './extractImages.js';

export default function ExtractImagesTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const result = await extractImages(file, onProgress);
      return {
        blob: new Blob([result.bytes], { type: 'application/zip' }),
        fileName: outputName(file.name, '-images', 'zip'),
        noteKey: 'extractImages.count',
        noteVars: { count: result.count },
      };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: 'run.extractImages', enabled: Boolean(file), onRun: run }}>
      <p>{t('extractImages.hint')}</p>
    </ToolWorkspace>
  );
}
