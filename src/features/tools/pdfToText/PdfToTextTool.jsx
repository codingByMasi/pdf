// PDF to Text screen: gets the words out of a PDF as a .txt file (also covers "extract text").
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { extractPageTexts } from '../../../shared/lib/pdfText.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';

export default function PdfToTextTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;

  function run() {
    job.run(async (onProgress) => {
      const pages = await extractPageTexts(file, onProgress);
      if (!pages.join('').trim()) throw Object.assign(new Error('no text'), { errorKey: 'error.noText' });
      const text = pages.map((page, i) => `${t('compare.pageLine', { page: i + 1 })}\n\n${page}`).join('\n\n\n');
      return { blob: new Blob([text], { type: 'text/plain;charset=utf-8' }), fileName: outputName(file.name, '', 'txt') };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: 'run.pdfToText', enabled: Boolean(file), onRun: run }}>
      <p>{t('pdfToText.hint')}</p>
    </ToolWorkspace>
  );
}
