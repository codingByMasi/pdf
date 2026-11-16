// Invert Colors screen: turns every page into a picture with the colours flipped (good for dark reading or saving ink).
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { invertInPlace } from './invertPixels.js';

export default function InvertTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const draw = (context, used, index, canvas) => {
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        invertInPlace(image.data);
        context.putImageData(image, 0, 0);
      };
      const pages = await rasterizePdf(bytes, { scale: 2, quality: 0.85, draw }, (v) => onProgress(v * 0.8));
      const data = await runTask('rasterPages', { pages }, { onProgress: (v) => onProgress(80 + v * 0.2) });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-inverted') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.invert', enabled: info.status === 'ready', onRun: run }}
    >
      <StatusMessage kind="info">{t('invert.note')}</StatusMessage>
    </ToolWorkspace>
  );
}
