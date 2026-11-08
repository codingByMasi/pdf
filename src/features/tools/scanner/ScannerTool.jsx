// PDF Scanner screen: take photos with the phone camera or choose pictures, tidy each page, and make a PDF.
import { useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';
import { ScanPageEditor } from './ScanPageEditor.jsx';
import { renderScanPage } from './scanPages.js';

const FRESH = { rotation: 0, cuts: { top: 0, bottom: 0, left: 0, right: 0 } };

export default function ScannerTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const camera = useRef(null);
  const [edits, setEdits] = useState({});
  const [chosen, setChosen] = useState(null);
  const [filter, setFilter] = useState('bw');
  const [pageMode, setPageMode] = useState('a4');
  const { items } = selection;
  const current = items.find((item) => item.id === chosen) ?? items[0];

  function run() {
    job.run(async (onProgress) => {
      const images = [];
      for (let i = 0; i < items.length; i += 1) {
        const edit = edits[items[i].id] ?? FRESH;
        const blob = await renderScanPage(items[i].file, { ...edit, filter });
        images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), type: 'jpg' });
        onProgress(((i + 1) / items.length) * 60);
      }
      const bytes = await runTask('imagesToPdf', { images, pageMode }, { onProgress: (value) => onProgress(60 + value * 0.4) });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: 'scan.pdf' };
    });
  }

  function takePhoto(event) {
    const picked = Array.from(event.target.files);
    event.target.value = '';
    if (picked.length) selection.addFiles(picked);
  }

  return (
    <>
      <div className="editor-actions">
        <Button disabled={job.busy} onClick={() => camera.current.click()}>{t('scan.camera')}</Button>
        <input ref={camera} className="visually-hidden" type="file" tabIndex={-1} accept=".jpg,.jpeg,.png,image/jpeg,image/png" capture="environment" aria-label={t('scan.camera')} onChange={takePhoto} />
      </div>
      <ToolWorkspace
        tool={tool}
        selection={selection}
        job={job}
        reorderable
        hasFiles={items.length > 0}
        action={{ labelKey: 'run.scanner', enabled: items.length > 0, onRun: run }}
      >
        {items.length > 1 ? (
          <ChoiceGroup
            legend={t('scan.pickPage')}
            value={String(current?.id)}
            onChange={(value) => setChosen(Number(value))}
            options={items.map((item, i) => ({ value: String(item.id), label: t('scan.pageLabel', { n: i + 1, name: item.file.name }) }))}
          />
        ) : null}
        {current ? (
          <ScanPageEditor
            key={current.id}
            file={current.file}
            edit={edits[current.id] ?? FRESH}
            position={items.indexOf(current) + 1}
            onChange={(edit) => setEdits((now) => ({ ...now, [current.id]: edit }))}
          />
        ) : null}
        <ChoiceGroup
          legend={t('scan.filterLabel')}
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'bw', label: t('scan.bw') },
            { value: 'gray', label: t('scan.gray') },
            { value: 'color', label: t('scan.color') },
          ]}
        />
        <ChoiceGroup
          legend={t('jpgToPdf.pageLabel')}
          value={pageMode}
          onChange={setPageMode}
          options={[
            { value: 'a4', label: t('jpgToPdf.a4') },
            { value: 'fit', label: t('jpgToPdf.fit') },
          ]}
        />
      </ToolWorkspace>
    </>
  );
}
