// Assemble PDF screen: add several PDFs, order them, and choose which pages of each to keep.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { friendlyErrorKey } from '../../../shared/lib/friendlyError.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { parsePageRange } from '../../../shared/lib/parsePageRange.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function AssembleTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [ranges, setRanges] = useState({});
  const [problem, setProblem] = useState(null);
  const { items } = selection;

  async function run() {
    setProblem(null);
    const parts = [];
    for (const item of items) {
      const bytes = new Uint8Array(await item.file.arrayBuffer());
      const text = (ranges[item.id] ?? '').trim();
      let pages = null;
      if (text) {
        let count;
        try {
          count = (await loadPdf(bytes)).getPageCount();
        } catch (error) {
          setProblem({ key: error?.errorKey ?? friendlyErrorKey(error) });
          return;
        }
        const parsed = parsePageRange(text, count);
        if (parsed.errorKey) {
          setProblem({ key: parsed.errorKey, vars: parsed.vars });
          return;
        }
        pages = parsed.indices;
      }
      parts.push({ bytes, pages });
    }
    job.run(async (onProgress) => {
      const data = await runTask('assemble', { parts }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: 'assembled.pdf' };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      reorderable
      error={{ key: problem?.key, vars: problem?.vars }}
      action={{ labelKey: 'run.assemble', enabled: items.length >= 1, onRun: run }}
    >
      <p>{t('assemble.hint')}</p>
      {items.map((item, n) => (
        <TextField
          key={item.id}
          label={t('assemble.pagesOf', { number: n + 1, name: item.file.name })}
          value={ranges[item.id] ?? ''}
          placeholder={t('assemble.placeholder')}
          onChange={(event) => setRanges((old) => ({ ...old, [item.id]: event.target.value }))}
        />
      ))}
    </ToolWorkspace>
  );
}
