// PDF to image screen: choose PNG or JPG and a size, get all pages in one zip file.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { pdfToImages } from './pdfToImages.js';

const SCALES = { normal: 1.5, sharp: 2.5 };

export default function PdfToImageTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState('normal');
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const files = await pdfToImages(file, { format, scale: SCALES[size] }, onProgress);
      return { blob: new Blob([makeZip(files)], { type: 'application/zip' }), fileName: outputName(file.name, '-images', 'zip') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      action={{ labelKey: 'run.pdfToImage', enabled: Boolean(file), onRun: run }}
    >
      <ChoiceGroup
        legend={t('pdfToImage.formatLabel')}
        value={format}
        onChange={setFormat}
        options={[
          { value: 'png', label: t('pdfToImage.png') },
          { value: 'jpg', label: t('pdfToImage.jpg') },
        ]}
      />
      <ChoiceGroup
        legend={t('pdfToImage.sizeLabel')}
        value={size}
        onChange={setSize}
        options={[
          { value: 'normal', label: t('pdfToImage.normal') },
          { value: 'sharp', label: t('pdfToImage.sharp') },
        ]}
      />
    </ToolWorkspace>
  );
}
