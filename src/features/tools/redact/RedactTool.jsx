// Redact screen: draw black boxes. Pages with boxes become pictures, so the hidden text is truly gone.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { OverlayEditor } from '../overlay/OverlayEditor.jsx';
import { useOverlay } from '../overlay/useOverlay.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function RedactTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const overlay = useOverlay();
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pages = Object.keys(overlay.byPage).map(Number).filter((n) => overlay.byPage[n].length > 0);
      // Black boxes are painted straight into the page picture, so nothing is left underneath.
      const draw = (context, used, index, canvas) => {
        context.fillStyle = '#000000';
        for (const box of overlay.byPage[index]) {
          context.fillRect(Math.floor(box.x * canvas.width) - 1, Math.floor(box.y * canvas.width) - 1, Math.ceil(box.w * canvas.width) + 2, Math.ceil(box.h * canvas.width) + 2);
        }
      };
      const rasters = await rasterizePdf(bytes, { pages, scale: 2.2, quality: 0.9, draw }, (value) => onProgress(value * 0.7));
      const data = await runTask('replacePages', { bytes, rasters }, { onProgress: (value) => onProgress(70 + value * 0.3) });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-redacted') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status === 'ready'}
      action={{ labelKey: 'run.redact', enabled: overlay.total > 0, onRun: run }}
    >
      <StatusMessage kind="info">{t('redact.note')}</StatusMessage>
      <OverlayEditor key={file?.name} file={file} overlay={overlay} tools={['redact', 'select']} />
    </ToolWorkspace>
  );
}
