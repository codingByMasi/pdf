// Shared screen for text-based converters: add a file or paste text, press the button, get a PDF.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { decodeText } from '../../../shared/lib/decodeText.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { useState } from 'react';

// prepare(text) returns { task, payload, noteKey? } for runTask.
export default function TextConvertScreen({ tool, prepare }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [pasted, setPasted] = useState('');
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const text = file ? decodeText(new Uint8Array(await file.arrayBuffer())) : pasted;
      const { task, payload, noteKey } = await prepare(text);
      const result = await runTask(task, payload, { onProgress });
      const note = noteKey ? { noteKey } : result.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: result.replaced } } : {};
      return {
        blob: new Blob([result.bytes], { type: 'application/pdf' }),
        fileName: file ? outputName(file.name, '') : `${tool.id}.pdf`,
        ...note,
      };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      action={{ labelKey: `run.${tool.id}`, enabled: Boolean(file) || pasted.trim() !== '', onRun: run }}
    >
      {file ? null : (
        <TextField
          multiline
          label={t(`paste.${tool.kind}Label`)}
          hint={t('paste.hint')}
          value={pasted}
          spellCheck={false}
          onChange={(event) => setPasted(event.target.value)}
        />
      )}
    </ToolWorkspace>
  );
}
