// Rotate PDF screen: page pictures with turn buttons, and buttons to turn every page.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { PageEditGrid } from '../pageEditor/PageEditGrid.jsx';
import { usePageEdits } from '../pageEditor/usePageEdits.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function RotateTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const thumbs = useThumbnails(file);
  const pages = usePageEdits(file, thumbs.numPages);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await runTask('buildPages', { bytes, pages: pages.kept }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-rotated') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: thumbs.errorKey }}
      hasFiles={Boolean(file) && thumbs.status !== 'error'}
      action={{ labelKey: 'run.rotate', enabled: thumbs.status === 'ready' && pages.changed, onRun: run }}
    >
      {thumbs.status === 'loading' ? <StatusMessage kind="info">{t('thumbs.loading')}</StatusMessage> : null}
      <p>{t('rotate.hint')}</p>
      <div className="turn-all">
        <Button variant="light" disabled={job.busy} onClick={() => pages.turnEvery(-90)}>⟲ {t('rotate.allLeft')}</Button>
        <Button variant="light" disabled={job.busy} onClick={() => pages.turnEvery(90)}>⟳ {t('rotate.allRight')}</Button>
      </div>
      <PageEditGrid edits={pages.edits} urls={thumbs.urls} disabled={job.busy} onTurn={pages.turn} />
    </ToolWorkspace>
  );
}
