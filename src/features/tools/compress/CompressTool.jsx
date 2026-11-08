// Compress screen: choose how small, shrink the PDF, and show the before and after size.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { recompressJpeg } from './recompressJpeg.js';

const LEVELS = { balanced: { maxSide: 2000, quality: 0.72 }, smaller: { maxSide: 1400, quality: 0.5 } };

export default function CompressTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [level, setLevel] = useState('balanced');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const original = new Uint8Array(await file.arrayBuffer());
      const before = original.length;
      const services = { recompress: ({ bytes, maxSide, quality }) => recompressJpeg(bytes, { maxSide, quality }) };
      let bytes;
      if (level === 'strong') {
        // Every page becomes a small picture. Smallest result, but text can no longer be selected.
        const pages = await rasterizePdf(original, { scale: 1.4, quality: 0.55 }, (value) => onProgress(value * 0.8));
        bytes = await runTask('rasterPages', { pages }, { onProgress: (value) => onProgress(80 + value * 0.2) });
      } else {
        ({ bytes } = await runTask('compress', { bytes: original, ...LEVELS[level] }, { onProgress, services }));
      }
      const better = bytes.length < before;
      return {
        blob: better ? new Blob([bytes], { type: 'application/pdf' }) : file,
        fileName: outputName(file.name, '-smaller'),
        noteKey: better ? 'compress.result' : 'compress.nosmaller',
        noteVars: { before: formatSize(before), after: formatSize(better ? bytes.length : before) },
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
      action={{ labelKey: 'run.compress', enabled: info.status === 'ready', onRun: run }}
    >
      <ChoiceGroup
        legend={t('compress.levelLabel')}
        value={level}
        onChange={setLevel}
        options={[
          { value: 'balanced', label: t('compress.balanced') },
          { value: 'smaller', label: t('compress.smaller') },
          { value: 'strong', label: t('compress.strong') },
        ]}
      />
      {level === 'strong' ? <StatusMessage kind="info">{t('compress.strongNote')}</StatusMessage> : null}
    </ToolWorkspace>
  );
}
