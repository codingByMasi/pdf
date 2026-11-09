// PDF table to CSV screen: copies the rows of tables in a text PDF into a CSV file you can open in a spreadsheet.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { extractTextItems } from '../../../shared/lib/pdfTextItems.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { pagesToCsv } from './tableCsv.js';

export default function TableExtractTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [onlyTables, setOnlyTables] = useState(true);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const pages = await extractTextItems(file, (v) => onProgress(v * 0.95));
      if (!pages.some((items) => items.length > 0)) throw Object.assign(new Error('no text'), { errorKey: 'error.noTextLayer' });
      const csv = pagesToCsv(pages, { onlyTables });
      if (csv.length <= 1) throw Object.assign(new Error('no table'), { errorKey: 'tablecsv.none' });
      return { blob: new Blob([csv], { type: 'text/csv;charset=utf-8' }), fileName: outputName(file.name, '', 'csv'), noteKey: 'office.rough' };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: info.errorKey }} hasFiles={Boolean(file) && info.status !== 'error'} action={{ labelKey: 'run.tableExtract', enabled: info.status === 'ready', onRun: run }}>
      <StatusMessage kind="info">{t('tablecsv.hint')}</StatusMessage>
      <label className="choice"><input type="checkbox" checked={onlyTables} onChange={(e) => setOnlyTables(e.target.checked)} /><span>{t('tablecsv.only')}</span></label>
    </ToolWorkspace>
  );
}
