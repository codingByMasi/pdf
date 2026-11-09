// Check PDF screen: shows what is inside a PDF (version, sizes, fonts, pictures, forms, attachments, scripts) and offers it as a text file.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { inspectPdf } from './inspectPdf.js';

function lines(facts, size, t) {
  const yes = (v) => t(v ? 'check.yes' : 'check.no');
  return [
    [t('check.size'), formatSize(size)],
    [t('check.version'), facts.version || '?'],
    [t('check.pages'), String(facts.pages)],
    [t('check.sizes'), facts.sizes.map((s) => `${s.name} × ${s.count}`).join(', ')],
    [t('check.fonts'), facts.fonts.length ? facts.fonts.map((f) => `${f.name}${f.embedded ? '' : ` (${t('check.notEmbedded')})`}`).join(', ') : t('check.none')],
    [t('check.images'), String(facts.images)],
    [t('check.forms'), facts.forms ? t('check.fields', { count: facts.forms }) : t('check.no')],
    [t('check.bookmarks'), yes(facts.bookmarks)],
    [t('check.attachments'), yes(facts.attachments)],
    [t('check.scripts'), yes(facts.scripts)],
    [t('check.locked'), yes(facts.encrypted)],
  ];
}

export default function PdfCheckTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [rows, setRows] = useState(null);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    setRows(null);
    job.run(async () => {
      const facts = await inspectPdf(new Uint8Array(await file.arrayBuffer()));
      const list = lines(facts, file.size, t);
      setRows(list);
      return { blob: new Blob([`${file.name}\n\n${list.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`], { type: 'text/plain;charset=utf-8' }), fileName: 'pdf-check.txt' };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: info.errorKey }} hasFiles={Boolean(file) && info.status !== 'error'} action={{ labelKey: 'run.pdfCheck', enabled: info.status === 'ready', onRun: run }}>
      {rows ? (
        <dl className="check-list" aria-live="polite">
          {rows.map(([k, v]) => (
            <div key={k} className="check-row"><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      ) : null}
    </ToolWorkspace>
  );
}
