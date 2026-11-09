// Remove Blank Pages screen: finds pages with nothing on them and removes them.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { findBlankPages } from './findBlankPages.js';

export default function RemoveBlankTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [sensitivity, setSensitivity] = usePref('blank.level', 'normal');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blank = new Set(await findBlankPages(bytes, sensitivity, (v) => onProgress(v * 0.8)));
      if (blank.size === 0) return { blob: file, fileName: outputName(file.name, '-clean'), noteKey: 'blank.none' };
      if (blank.size >= info.pageCount) throw Object.assign(new Error('all blank'), { errorKey: 'error.allBlank' });
      const pages = Array.from({ length: info.pageCount }, (_, index) => ({ index })).filter((p) => !blank.has(p.index));
      const out = await runTask('buildPages', { bytes, pages }, { onProgress: (v) => onProgress(80 + v * 0.2) });
      return { blob: new Blob([out], { type: 'application/pdf' }), fileName: outputName(file.name, '-clean'), noteKey: 'blank.removed', noteVars: { count: blank.size } };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.removeBlank', enabled: info.status === 'ready', onRun: run }}
    >
      <ChoiceGroup
        legend={t('blank.level')}
        value={sensitivity}
        onChange={setSensitivity}
        options={['careful', 'normal', 'loose'].map((v) => ({ value: v, label: t(`blank.${v}`) }))}
      />
    </ToolWorkspace>
  );
}
