// Rotate and reorder screen: page pictures with turn and move buttons.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { PageThumb } from '../../../shared/ui/PageThumb.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { runTask } from '../worker/runTask.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { movePage, startEdits, turnPage } from './rotatePages.js';

export default function RotateTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const thumbs = useThumbnails(file);
  const [edits, setEdits] = useState([]);

  useEffect(() => setEdits(startEdits(thumbs.numPages)), [file, thumbs.numPages]);

  const changed = edits.some((edit, position) => edit.rotation !== 0 || edit.index !== position);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await runTask('buildPages', { bytes, pages: edits }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-edited') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: thumbs.errorKey }}
      hasFiles={Boolean(file) && thumbs.status !== 'error'}
      action={{ labelKey: 'run.rotate', enabled: thumbs.status === 'ready' && changed, onRun: run }}
    >
      {thumbs.status === 'loading' ? <StatusMessage kind="info">{t('thumbs.loading')}</StatusMessage> : null}
      <p>{t('rotate.hint')}</p>
      <ul className="page-grid">
        {edits.map((edit, position) => (
          <li key={edit.index} className="page-card">
            <PageThumb url={thumbs.urls[edit.index]} number={edit.index + 1} rotation={edit.rotation} />
            <div className="page-card-actions">
              <Button variant="light" disabled={job.busy} aria-label={t('rotate.left', { n: edit.index + 1 })} onClick={() => setEdits(turnPage(edits, position, -90))}>⟲</Button>
              <Button variant="light" disabled={job.busy} aria-label={t('rotate.right', { n: edit.index + 1 })} onClick={() => setEdits(turnPage(edits, position, 90))}>⟳</Button>
              <Button variant="light" disabled={job.busy || position === 0} aria-label={t('rotate.earlier', { n: edit.index + 1 })} onClick={() => setEdits(movePage(edits, position, -1))}>◀</Button>
              <Button variant="light" disabled={job.busy || position === edits.length - 1} aria-label={t('rotate.later', { n: edit.index + 1 })} onClick={() => setEdits(movePage(edits, position, 1))}>▶</Button>
            </div>
          </li>
        ))}
      </ul>
    </ToolWorkspace>
  );
}
