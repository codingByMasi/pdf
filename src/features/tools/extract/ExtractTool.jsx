// Extract PDF Pages screen: tick the pages to keep (or type numbers), save them as a new PDF.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { useThumbnails } from '../../../shared/lib/useThumbnails.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { PageSelectionTools } from '../pageEditor/PageSelectionTools.jsx';
import { PageTickGrid } from '../pageEditor/PageTickGrid.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function ExtractTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const thumbs = useThumbnails(file);
  const [kept, setKept] = useState(new Set());

  useEffect(() => setKept(new Set()), [file]);

  function toggle(index) {
    const next = new Set(kept);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setKept(next);
  }

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pages = [...kept].sort((a, b) => a - b).map((index) => ({ index }));
      const data = await runTask('buildPages', { bytes, pages }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-extract') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: thumbs.errorKey }}
      hasFiles={Boolean(file) && thumbs.status !== 'error'}
      action={{ labelKey: 'run.extract', enabled: thumbs.status === 'ready' && kept.size > 0, onRun: run }}
    >
      {thumbs.status === 'loading' ? <StatusMessage kind="info">{t('thumbs.loading')}</StatusMessage> : null}
      <p>{t('extract.hint')}</p>
      <PageSelectionTools pageCount={thumbs.numPages} disabled={job.busy || thumbs.numPages === 0} onSelect={setKept} />
      <PageTickGrid count={thumbs.numPages} urls={thumbs.urls} selected={kept} disabled={job.busy} checkKey="extract.pageCheck" onToggle={toggle} />
      <p>{kept.size > 0 ? t('extract.summary', { count: kept.size }) : t('extract.selectSome')}</p>
    </ToolWorkspace>
  );
}
