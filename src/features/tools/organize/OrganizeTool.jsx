// Organize PDF screen: reorder, turn and remove pages in one place, then save once.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { PageEditGrid } from '../pageEditor/PageEditGrid.jsx';
import { usePageEdits } from '../pageEditor/usePageEdits.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function OrganizeTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const thumbs = useThumbnails(file);
  const pages = usePageEdits(file, thumbs.numPages);
  const none = thumbs.numPages > 0 && pages.kept.length === 0;

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await runTask('buildPages', { bytes, pages: pages.kept }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-organized') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: thumbs.errorKey || (none ? 'error.deleteAll' : '') }}
      hasFiles={Boolean(file) && thumbs.status !== 'error'}
      action={{ labelKey: 'run.organize', enabled: thumbs.status === 'ready' && pages.changed && !none, onRun: run }}
    >
      {thumbs.status === 'loading' ? <StatusMessage kind="info">{t('thumbs.loading')}</StatusMessage> : null}
      <p>{t('organize.hint')}</p>
      <PageEditGrid
        edits={pages.edits}
        urls={thumbs.urls}
        disabled={job.busy}
        allowMove
        allowRemove
        onTurn={pages.turn}
        onMove={pages.move}
        onMoveTo={pages.moveTo}
        onRemove={pages.remove}
      />
    </ToolWorkspace>
  );
}
