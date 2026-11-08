// Crop screen: see page 1, slide the four edges in, and save a cropped PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { CropPreview } from './CropPreview.jsx';

const NONE = { top: 0, bottom: 0, left: 0, right: 0 };

export default function CropTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [cuts, setCuts] = useState(NONE);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);
  const preview = useThumbnails(info.status === 'ready' ? file : null, { width: 520, firstOnly: true });
  const changed = Object.values(cuts).some((value) => value > 0);

  function change(side, value) {
    setCuts((now) => ({ ...now, [side]: value }));
  }

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await runTask('crop', { bytes, cuts }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-cropped') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.crop', enabled: info.status === 'ready' && changed, onRun: run }}
    >
      <CropPreview url={preview.urls[0]} cuts={cuts} onChange={change} />
      <StatusMessage kind="info">{t('crop.note')}</StatusMessage>
    </ToolWorkspace>
  );
}
