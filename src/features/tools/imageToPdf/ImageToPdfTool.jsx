// Image to PDF screen: add photos, put them in order, choose the page size, make a PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { imagesToPdf } from './imagesToPdf.js';
import { prepareImage } from './prepareImage.js';

export default function ImageToPdfTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [pageMode, setPageMode] = useState('fit');
  const { items } = selection;

  function run() {
    job.run(async (onProgress) => {
      const images = [];
      for (const item of items) images.push(await prepareImage(item.file));
      const bytes = await imagesToPdf(images, { pageMode }, onProgress);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: 'images.pdf' };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      reorderable
      action={{ labelKey: 'run.imageToPdf', enabled: items.length > 0, onRun: run }}
    >
      <ChoiceGroup
        legend={t('imageToPdf.pageLabel')}
        value={pageMode}
        onChange={setPageMode}
        options={[
          { value: 'fit', label: t('imageToPdf.fit') },
          { value: 'a4', label: t('imageToPdf.a4') },
        ]}
      />
    </ToolWorkspace>
  );
}
