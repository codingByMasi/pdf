// ZIP to PDF screen: takes the pictures inside a zip file, in name order, and puts them into one PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { prepareImageBytes } from '../jpgToPdf/prepareImage.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { readZipImages } from './zipReader.js';

export default function ZipToPdfTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [pageMode, setPageMode] = useState('fit');
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const { images, skipped } = await readZipImages(new Uint8Array(await file.arrayBuffer()));
      const prepared = [];
      for (const image of images) prepared.push(await prepareImageBytes(image.bytes));
      const bytes = await runTask('imagesToPdf', { images: prepared, pageMode }, { onProgress });
      return {
        blob: new Blob([bytes], { type: 'application/pdf' }),
        fileName: outputName(file.name, ''),
        ...(skipped > 0 ? { noteKey: 'note.zipSkipped', noteVars: { count: skipped } } : {}),
      };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      hasFiles={Boolean(file)}
      action={{ labelKey: 'run.zipToPdf', enabled: Boolean(file), onRun: run }}
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
