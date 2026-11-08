// PDF Reader screen: look at a PDF page by page, zoom in and out, and jump to a page. Nothing is saved.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfViewer } from '../../../shared/lib/usePdfViewer.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { PageNav } from '../overlay/PageNav.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';

const ZOOMS = [1, 1.5, 2, 3];

export default function ReaderTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [zoom, setZoom] = useState(0);
  const file = selection.items[0]?.file;
  const level = ZOOMS[zoom];
  const viewer = usePdfViewer(file, Math.min(2400, Math.round(1000 * level)));

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: viewer.status === 'error' ? viewer.errorKey : '' }}
      hasFiles={Boolean(file) && viewer.status === 'ready'}
    >
      <PageNav page={viewer.page} numPages={viewer.numPages} onChange={viewer.setPage} />
      <TextField
        label={t('reader.goTo')}
        type="number"
        inputMode="numeric"
        min="1"
        max={viewer.numPages}
        value={viewer.page + 1}
        onChange={(event) => viewer.setPage(Number(event.target.value) - 1)}
      />
      <div className="editor-actions" role="group" aria-label={t('reader.zoom')}>
        <Button variant="secondary" disabled={zoom === 0} onClick={() => setZoom(zoom - 1)}>{t('reader.smaller')}</Button>
        <Button variant="secondary" disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom(zoom + 1)}>{t('reader.bigger')}</Button>
      </div>
      <div className="reader-scroll" tabIndex={0} aria-label={t('viewer.pageAlt', { page: viewer.page + 1 })}>
        {viewer.url ? (
          <img className="reader-image" style={{ width: `${level * 100}%` }} src={viewer.url} alt={t('viewer.pageAlt', { page: viewer.page + 1 })} />
        ) : <p>{t('progress.wait')}</p>}
      </div>
      <StatusMessage kind="info">{t('reader.note')}</StatusMessage>
    </ToolWorkspace>
  );
}
