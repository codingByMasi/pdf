// Shared screen for picture tools: add a picture, show options, run one job on the main thread, download the result.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { useImage } from '../../../shared/lib/useImage.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';

// run({ file, files, image, onProgress }) returns { blob, fileName, noteKey?, noteVars? }.
// children can be a function that gets (image, file). many: the tool takes several pictures (image is then not loaded).
export default function ImageEditScreen({ tool, run, children, canRun = true, many = false, reorderable = false, details = true }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const files = selection.items.map((item) => item.file);
  const file = files[0];
  const image = useImage(many ? null : file);
  const ready = many ? files.length > 0 : image.status === 'ready';

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: image.errorKey }}
      hasFiles={files.length > 0 && image.status !== 'error'}
      reorderable={reorderable}
      action={{ labelKey: `run.${tool.id}`, enabled: ready && canRun, onRun: () => job.run((onProgress) => run({ file, files, image, onProgress })) }}
    >
      {many || !details ? null : image.status === 'ready' ? <p>{t('image.info', { width: image.width, height: image.height, size: formatSize(file.size) })}</p> : <p>{t('file.reading')}</p>}
      {ready && typeof children === 'function' ? children(image, file) : children}
    </ToolWorkspace>
  );
}
