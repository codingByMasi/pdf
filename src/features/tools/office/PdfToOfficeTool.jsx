// PDF to Word, Excel and PowerPoint screen: copies the text of each page into a plain file (rough: no layout, pictures or styles).
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { extractTextItems } from '../../../shared/lib/pdfTextItems.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { rowsFromItems } from './pdfRows.js';
import { writeDocx } from './writeDocx.js';
import { writePptx } from './writePptx.js';
import { writeXlsx } from './writeXlsx.js';

const MIME = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export function buildOffice(format, pages, t) {
  const rows = pages.map((items) => rowsFromItems(items));
  if (format === 'docx') return writeDocx(rows.map((page) => page.map((cells) => cells.join('  '))));
  if (format === 'xlsx') return writeXlsx(rows, t('office.page'));
  return writePptx(rows.map((page, i) => ({ title: `${t('office.page')} ${i + 1}`, lines: page.map((cells) => cells.join('  ')) })));
}

export default function PdfToOfficeTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);
  const format = tool.format;

  function run() {
    job.run(async (onProgress) => {
      const pages = await extractTextItems(file, (v) => onProgress(v * 0.9));
      if (!pages.some((items) => items.length > 0)) throw Object.assign(new Error('no text'), { errorKey: 'error.noTextLayer' });
      const data = buildOffice(format, pages, t);
      return { blob: new Blob([data], { type: MIME[format] }), fileName: outputName(file.name, '', format), noteKey: 'office.rough' };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: info.errorKey }} hasFiles={Boolean(file) && info.status !== 'error'} action={{ labelKey: `run.${tool.id}`, enabled: info.status === 'ready', onRun: run }}>
      <StatusMessage kind="info">{t(`office.hint.pdfTo.${format}`)}</StatusMessage>
    </ToolWorkspace>
  );
}
