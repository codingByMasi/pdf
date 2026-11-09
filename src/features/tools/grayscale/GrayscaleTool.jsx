// Grayscale screen: turns every page into a grey or black-and-white picture (text can no longer be selected).
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { grayInPlace } from './grayPixels.js';

export default function GrayscaleTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [mode, setMode] = usePref('gray.mode', 'gray');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const draw = (context, used, index, canvas) => {
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        grayInPlace(image.data, mode === 'bw' ? 150 : null);
        context.putImageData(image, 0, 0);
      };
      const pages = await rasterizePdf(bytes, { scale: 2, quality: 0.8, draw }, (v) => onProgress(v * 0.8));
      const data = await runTask('rasterPages', { pages }, { onProgress: (v) => onProgress(80 + v * 0.2) });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, mode === 'bw' ? '-blackwhite' : '-grey') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.grayscale', enabled: info.status === 'ready', onRun: run }}
    >
      <ChoiceGroup legend={t('gray.mode')} value={mode} onChange={setMode} options={[{ value: 'gray', label: t('gray.gray') }, { value: 'bw', label: t('gray.bw') }]} />
      <StatusMessage kind="info">{t('gray.note')}</StatusMessage>
    </ToolWorkspace>
  );
}
