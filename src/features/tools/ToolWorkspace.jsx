// Working area shared by all tools: add files, options, action button, progress, result, and errors.
import { useEffect } from 'react';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Button } from '../../shared/ui/Button.jsx';
import { DownloadButton } from '../../shared/ui/DownloadButton.jsx';
import { DropZone } from '../../shared/ui/DropZone.jsx';
import { FileList } from '../../shared/ui/FileList.jsx';
import { ProgressBar } from '../../shared/ui/ProgressBar.jsx';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';

export function ToolWorkspace({ tool, selection, job, reorderable, hasFiles = true, children, action, error }) {
  const { t } = useI18n();
  const { items } = selection;
  const { reset } = job;

  useEffect(() => reset(), [items, reset]);

  const shownError = error?.key || selection.errorKey || job.errorKey;
  return (
    <section className="workspace workspace-card" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" className="visually-hidden">{t('tool.workspace')}</h2>
      <DropZone kind={tool.kind} multiple={tool.multiple} disabled={job.busy} compact={items.length > 0} onFiles={selection.addFiles} />
      {shownError ? (
        <StatusMessage title={t('error.heading')}>{t(shownError, error?.vars)}</StatusMessage>
      ) : null}
      <FileList
        items={items}
        disabled={job.busy}
        onRemove={selection.removeItem}
        onMove={reorderable ? selection.moveItem : undefined}
        onMoveTo={reorderable ? selection.moveItemTo : undefined}
      />
      {hasFiles ? children : null}
      {action && hasFiles ? (
        <Button disabled={job.busy || !action.enabled} onClick={action.onRun}>{t(action.labelKey)}</Button>
      ) : null}
      {job.busy ? <ProgressBar value={job.progress} /> : null}
      {job.result ? <DownloadButton blob={job.result.blob} fileName={job.result.fileName} onStartOver={selection.clear} /> : null}
      {job.result?.noteKey ? <StatusMessage kind="info">{t(job.result.noteKey, job.result.noteVars)}</StatusMessage> : null}
    </section>
  );
}
