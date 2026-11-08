// Shared screen for PDF to JPG and PDF to PNG: choose a size, get all pages in one zip file.
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

export function ImageExportScreen({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [size, setSize] = useState('normal');
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const files = await pdfToImages(file, { format: tool.format, scale: SCALES[size] }, onProgress);
      return { blob: new Blob([makeZip(files)], { type: 'application/zip' }), fileName: outputName(file.name, `-${tool.format}`, 'zip') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      action={{ labelKey: `run.${tool.id}`, enabled: Boolean(file), onRun: run }}
    >
      <ChoiceGroup
        legend={t('imageExport.sizeLabel')}
        value={size}
        onChange={setSize}
        options={[
          { value: 'normal', label: t('imageExport.normal') },
          { value: 'sharp', label: t('imageExport.sharp') },
        ]}
      />
    </ToolWorkspace>
  );
}
