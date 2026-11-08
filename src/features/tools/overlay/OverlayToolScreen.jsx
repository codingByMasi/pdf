// Shared screen for tools that put things on top of pages: Annotate, Edit and Sign.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { itemsForWorker } from './applyOverlays.js';
import { OverlayEditor } from './OverlayEditor.jsx';
import { useOverlay } from './useOverlay.js';

// tools: tool names to offer. before: something shown above the editor. extra(api): more editor buttons.
export default function OverlayToolScreen({ tool, tools, addText, addPicture, extra, before, suffix, noteKey }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const overlay = useOverlay();
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await runTask('overlay', { bytes, byPage: itemsForWorker(overlay.byPage) }, { onProgress });
      return {
        blob: new Blob([result.bytes], { type: 'application/pdf' }),
        fileName: outputName(file.name, suffix),
        ...(result.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: result.replaced } } : {}),
      };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status === 'ready'}
      action={{ labelKey: `run.${tool.id}`, enabled: overlay.total > 0, onRun: run }}
    >
      {noteKey ? <StatusMessage kind="info">{t(noteKey)}</StatusMessage> : null}
      {before}
      <OverlayEditor key={file?.name} file={file} overlay={overlay} tools={tools} addText={addText} addPicture={addPicture} extra={extra} />
    </ToolWorkspace>
  );
}
