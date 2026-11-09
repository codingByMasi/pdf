// Frame for the document makers: form on top, one button that makes the PDF, then progress and download.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { DownloadButton } from '../../../shared/ui/DownloadButton.jsx';
import { ProgressBar } from '../../../shared/ui/ProgressBar.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';

// make(onProgress) returns { bytes, replaced?, fileName, noteKey? }. job lets the screen reset when the form changes.
export function DocShell({ toolId, make, canRun = true, children }) {
  const { t } = useI18n();
  const job = usePdfJob();
  const run = () => job.run(async (onProgress) => {
    const out = await make(onProgress);
    const note = out.noteKey ? { noteKey: out.noteKey, noteVars: out.noteVars } : out.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: out.replaced } } : {};
    return { blob: new Blob([out.bytes], { type: 'application/pdf' }), fileName: out.fileName, ...note };
  });
  const shownError = job.errorKey;
  return (
    <section className="workspace workspace-card" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" className="visually-hidden">{t('tool.workspace')}</h2>
      {children}
      {shownError ? <StatusMessage title={t('error.heading')}>{t(shownError)}</StatusMessage> : null}
      <Button disabled={job.busy || !canRun} onClick={run}>{t(`run.${toolId}`)}</Button>
      {job.busy ? <ProgressBar value={job.progress} /> : null}
      {job.result ? <DownloadButton blob={job.result.blob} fileName={job.result.fileName} onStartOver={job.reset} /> : null}
      {job.result?.noteKey ? <StatusMessage kind="info">{t(job.result.noteKey, job.result.noteVars)}</StatusMessage> : null}
    </section>
  );
}
