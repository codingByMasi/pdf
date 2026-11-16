// PDF Overlay screen: add two PDFs; the second is placed on top of (or behind) the first, page by page.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function PdfLayerTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [position, setPosition] = usePref('layer.position', 'top');
  const { items } = selection;

  function run() {
    job.run(async (onProgress) => {
      const [main, layer] = await Promise.all(items.slice(0, 2).map(async (item) => new Uint8Array(await item.file.arrayBuffer())));
      const bytes = await runTask('layerPdf', { main, layer, position }, { onProgress });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: outputName(items[0].file.name, '-overlay') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      reorderable
      action={{ labelKey: 'run.pdfLayer', enabled: items.length === 2, onRun: run }}
    >
      <StatusMessage kind="info">{t(items.length === 2 ? 'layer.order' : 'layer.needTwo')}</StatusMessage>
      <ChoiceGroup
        legend={t('layer.position')}
        value={position}
        onChange={setPosition}
        options={[{ value: 'top', label: t('layer.top') }, { value: 'behind', label: t('layer.behind') }]}
      />
      {position === 'behind' ? <StatusMessage kind="info">{t('layer.behindNote')}</StatusMessage> : null}
    </ToolWorkspace>
  );
}
