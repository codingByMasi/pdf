// Flatten screen: lock fill-in fields (keeps text), or turn every page into a picture (locks everything).
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function FlattenTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [mode, setMode] = useState('forms');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const fileName = outputName(file.name, '-flattened');
      if (mode === 'forms') {
        const result = await runTask('flattenForms', { bytes }, { onProgress });
        const note = result.fields === 0 ? { noteKey: 'flatten.noFields' } : {};
        return { blob: new Blob([result.bytes], { type: 'application/pdf' }), fileName, ...note };
      }
      const pages = await rasterizePdf(bytes, { scale: 2, quality: 0.88 }, (value) => onProgress(value * 0.8));
      const data = await runTask('rasterPages', { pages }, { onProgress: (value) => onProgress(80 + value * 0.2) });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.flatten', enabled: info.status === 'ready', onRun: run }}
    >
      <ChoiceGroup
        legend={t('flatten.modeLabel')}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'forms', label: t('flatten.forms') },
          { value: 'all', label: t('flatten.all') },
        ]}
      />
      {mode === 'all' ? <StatusMessage kind="info">{t('flatten.allNote')}</StatusMessage> : null}
    </ToolWorkspace>
  );
}
