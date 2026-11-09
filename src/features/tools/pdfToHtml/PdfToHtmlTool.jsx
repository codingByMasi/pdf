// PDF to HTML / PDF to Markdown screen (rough, text only). tool.format says which one.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { extractPageTexts } from '../../../shared/lib/pdfText.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { pagesToHtml, pagesToMarkdown } from './textFormats.js';

export default function PdfToHtmlTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const html = tool.format === 'html';

  function run() {
    job.run(async (onProgress) => {
      const pages = await extractPageTexts(file, onProgress);
      if (!pages.join('').trim()) throw Object.assign(new Error('no text'), { errorKey: 'error.noText' });
      const word = t('compare.pageLine', { page: '' }).trim();
      const text = html ? pagesToHtml(pages, file.name, word) : pagesToMarkdown(pages, word);
      return {
        blob: new Blob([text], { type: html ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8' }),
        fileName: outputName(file.name, '', html ? 'html' : 'md'),
        noteKey: 'pdfToHtml.rough',
      };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} hasFiles={Boolean(file)} action={{ labelKey: `run.${tool.id}`, enabled: Boolean(file), onRun: run }}>
      <p>{t('pdfToHtml.hint')}</p>
    </ToolWorkspace>
  );
}
