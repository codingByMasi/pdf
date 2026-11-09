// Compress to Size screen: type a wanted size (in KB or MB) and the PDF is shrunk until it fits, if that is possible.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { recompressJpeg } from '../compress/recompressJpeg.js';
import { runTask } from '../worker/runTask.js';
import { compressToTarget } from './compressToTarget.js';

export default function CompressTargetTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [amount, setAmount] = useState('200');
  const [unit, setUnit] = usePref('target.unit', 'kb');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);
  const wanted = Math.round(Number(amount) * (unit === 'mb' ? 1048576 : 1024));
  const valid = Number.isFinite(wanted) && wanted >= 10240;

  function run() {
    job.run(async (onProgress) => {
      const original = new Uint8Array(await file.arrayBuffer());
      const services = { recompress: ({ bytes, maxSide, quality }) => recompressJpeg(bytes, { maxSide, quality }) };
      const doStep = async (step, progress) => {
        if (step.kind === 'images') return (await runTask('compress', { bytes: original.slice(), maxSide: step.maxSide, quality: step.quality }, { onProgress: progress, services })).bytes;
        const pages = await rasterizePdf(original, { scale: step.scale, quality: step.quality }, (v) => progress(v * 0.8));
        return runTask('rasterPages', { pages }, { onProgress: (v) => progress(80 + v * 0.2) });
      };
      const result = await compressToTarget(original, wanted, doStep, onProgress);
      const vars = { before: formatSize(original.length), after: formatSize(result.bytes.length), target: formatSize(wanted) };
      if (result.step === -1) return { blob: file, fileName: outputName(file.name, '-smaller'), noteKey: result.met ? 'target.already' : 'target.cannot', noteVars: vars };
      return { blob: new Blob([result.bytes], { type: 'application/pdf' }), fileName: outputName(file.name, '-smaller'), noteKey: result.met ? 'target.met' : 'target.notMet', noteVars: vars };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.compressTarget', enabled: info.status === 'ready' && valid, onRun: run }}
    >
      <TextField label={t('target.size')} hint={t('target.hint')} type="number" inputMode="numeric" min="10" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <ChoiceGroup legend={t('target.unit')} value={unit} onChange={setUnit} options={[{ value: 'kb', label: 'KB' }, { value: 'mb', label: 'MB' }]} />
    </ToolWorkspace>
  );
}
