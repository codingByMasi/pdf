// Word, Excel and PowerPoint to PDF screen: reads the text of the file and makes a plain PDF (layout, pictures and charts are not kept).
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { readOffice } from './readOffice.js';

export default function OfficeToPdfTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      onProgress(10);
      const { blocks, notes } = await readOffice(new Uint8Array(await file.arrayBuffer()), tool.kind);
      const result = await runTask('htmlToPdf', { blocks }, { onProgress: (v) => onProgress(10 + v * 0.9) });
      const noteKey = result.replaced > 0 ? 'note.replaced' : notes[0];
      return { blob: new Blob([result.bytes], { type: 'application/pdf' }), fileName: outputName(file.name, '', 'pdf'), noteKey, noteVars: result.replaced > 0 ? { count: result.replaced } : undefined };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: `run.${tool.id}`, enabled: Boolean(file), onRun: run }}>
      <StatusMessage kind="info">{t(`office.hint.${tool.kind}`)}</StatusMessage>
    </ToolWorkspace>
  );
}
