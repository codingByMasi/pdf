// Shared screen for one-file PDF tools: add a file, show options, run one worker job, download the result.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

// prepare(info) gives { error: { key, vars } } or { task, payload }. children can be a function that gets (info, file).
// note(result) may return { noteKey, noteVars } to show under the download. suffix, ext, mime describe the output.
export default function SimplePdfTool({ tool, prepare, suffix, ext = 'pdf', mime = 'application/pdf', note, canRun = true, children }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);
  const [problem, setProblem] = useState(null);

  function run() {
    const plan = prepare(info);
    setProblem(plan.error ?? null);
    if (plan.error) return;
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await runTask(plan.task, { bytes, ...plan.payload }, { onProgress });
      const data = result?.bytes ?? result;
      return {
        blob: new Blob([data], { type: mime }),
        fileName: outputName(file.name, suffix, ext),
        ...(note?.(result) ?? {}),
      };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey || problem?.key, vars: problem?.vars }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: `run.${tool.id}`, enabled: info.status === 'ready' && canRun, onRun: run }}
    >
      {info.status === 'ready' ? <p>{t('split.pageCount', { count: info.pageCount })}</p> : <p>{t('file.reading')}</p>}
      {typeof children === 'function' ? children(info, file) : children}
    </ToolWorkspace>
  );
}
