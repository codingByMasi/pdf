// Delete pages screen: tick the pages to remove, then save a new PDF without them.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { PageThumb } from '../../../shared/ui/PageThumb.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { runTask } from '../worker/runTask.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { pagesToKeep, toggleRemoved } from './deletePages.js';

export default function DeleteTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const thumbs = useThumbnails(file);
  const [removed, setRemoved] = useState(new Set());

  useEffect(() => setRemoved(new Set()), [file]);

  const all = thumbs.numPages > 0 && removed.size === thumbs.numPages;

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pages = pagesToKeep(thumbs.numPages, removed);
      const data = await runTask('buildPages', { bytes, pages }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-edited') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: thumbs.errorKey || (all ? 'error.deleteAll' : '') }}
      hasFiles={Boolean(file) && thumbs.status !== 'error'}
      action={{ labelKey: 'run.delete', enabled: thumbs.status === 'ready' && removed.size > 0 && !all, onRun: run }}
    >
      {thumbs.status === 'loading' ? <StatusMessage kind="info">{t('thumbs.loading')}</StatusMessage> : null}
      <p>{t('delete.hint')}</p>
      <ul className="page-grid">
        {Array.from({ length: thumbs.numPages }, (_, index) => (
          <li key={index} className="page-card">
            <PageThumb url={thumbs.urls[index]} number={index + 1} dimmed={removed.has(index)} />
            <label className="choice">
              <input
                type="checkbox"
                checked={removed.has(index)}
                disabled={job.busy}
                onChange={() => setRemoved(toggleRemoved(removed, index))}
              />
              <span>{t('delete.pageCheck', { n: index + 1 })}</span>
            </label>
          </li>
        ))}
      </ul>
      {removed.size > 0 ? <p>{t('delete.summary', { count: removed.size })}</p> : <p>{t('delete.selectSome')}</p>}
    </ToolWorkspace>
  );
}
