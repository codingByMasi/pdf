// Watermark screen: type the words, press the button, get a PDF with a slanted mark on every page.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function WatermarkTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [text, setText] = useState('');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await runTask('watermark', { bytes, text }, { onProgress });
      return {
        blob: new Blob([result.bytes], { type: 'application/pdf' }),
        fileName: outputName(file.name, '-watermark'),
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
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.watermark', enabled: info.status === 'ready' && text.trim() !== '', onRun: run }}
    >
      <TextField
        label={t('watermark.textLabel')}
        value={text}
        maxLength={40}
        autoComplete="off"
        onChange={(event) => setText(event.target.value)}
      />
    </ToolWorkspace>
  );
}
