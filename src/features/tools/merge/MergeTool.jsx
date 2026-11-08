// Merge PDF screen: add files, put them in order, join into one PDF.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function MergeTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const { items } = selection;

  function run() {
    job.run(async (onProgress) => {
      const all = await Promise.all(items.map(async (item) => new Uint8Array(await item.file.arrayBuffer())));
      const bytes = await runTask('merge', { pdfs: all }, { onProgress });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: 'merged.pdf' };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      reorderable
      action={{ labelKey: 'run.merge', enabled: items.length >= 2, onRun: run }}
    >
      {items.length === 1 ? <StatusMessage kind="info">{t('merge.needTwo')}</StatusMessage> : null}
    </ToolWorkspace>
  );
}
