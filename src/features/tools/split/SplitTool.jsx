// Split PDF screen: keep chosen pages as one PDF, or get every page as its own file in a zip.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { parsePageRange } from '../../../shared/lib/parsePageRange.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function SplitTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [mode, setMode] = useState('range');
  const [rangeText, setRangeText] = useState('');
  const [rangeError, setRangeError] = useState(null);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    let indices = [];
    if (mode === 'range') {
      const parsed = parsePageRange(rangeText, info.pageCount);
      if (parsed.errorKey) {
        setRangeError({ key: parsed.errorKey, vars: parsed.vars });
        return;
      }
      indices = parsed.indices;
    }
    setRangeError(null);
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (mode === 'range') {
        const pages = indices.map((index) => ({ index }));
        const data = await runTask('buildPages', { bytes, pages }, { onProgress });
        return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-pages') };
      }
      const zip = await runTask('splitToZip', { bytes }, { onProgress });
      return { blob: new Blob([zip], { type: 'application/zip' }), fileName: outputName(file.name, '-pages', 'zip') };
    });
  }

  const ready = info.status === 'ready';
  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey || rangeError?.key, vars: rangeError?.vars }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.split', enabled: ready, onRun: run }}
    >
      {ready ? <p>{t('split.pageCount', { count: info.pageCount })}</p> : <p>{t('file.reading')}</p>}
      <ChoiceGroup
        legend={t('split.modeLabel')}
        value={mode}
        onChange={(next) => { setMode(next); setRangeError(null); }}
        options={[
          { value: 'range', label: t('split.modeRange') },
          { value: 'every', label: t('split.modeEvery') },
        ]}
      />
      {mode === 'range' ? (
        <TextField
          label={t('split.rangeLabel')}
          value={rangeText}
          inputMode="numeric"
          autoComplete="off"
          onChange={(event) => setRangeText(event.target.value)}
        />
      ) : (
        <p>{t('split.everyInfo', { count: info.pageCount })}</p>
      )}
    </ToolWorkspace>
  );
}
