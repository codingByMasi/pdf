// Watermark and page numbers screen: tick what to add, choose options, save a new PDF.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { addMarks } from './addMarks.js';

export default function WatermarkTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [useMark, setUseMark] = useState(true);
  const [markText, setMarkText] = useState('');
  const [useNumbers, setUseNumbers] = useState(false);
  const [position, setPosition] = useState('center');
  const [style, setStyle] = useState('simple');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  const markReady = useMark && markText.trim() !== '';
  const canRun = info.status === 'ready' && (markReady || useNumbers);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const data = await addMarks(
        bytes,
        { watermarkText: useMark ? markText : '', numbers: useNumbers ? { position, style } : null },
        onProgress,
      );
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-marked') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.watermark', enabled: canRun, onRun: run }}
    >
      <label className="choice">
        <input type="checkbox" checked={useMark} onChange={(event) => setUseMark(event.target.checked)} />
        <span>{t('watermark.useWatermark')}</span>
      </label>
      {useMark ? (
        <TextField
          label={t('watermark.textLabel')}
          value={markText}
          maxLength={40}
          autoComplete="off"
          onChange={(event) => setMarkText(event.target.value)}
        />
      ) : null}
      <label className="choice">
        <input type="checkbox" checked={useNumbers} onChange={(event) => setUseNumbers(event.target.checked)} />
        <span>{t('watermark.useNumbers')}</span>
      </label>
      {useNumbers ? (
        <>
          <ChoiceGroup
            legend={t('watermark.positionLabel')}
            value={position}
            onChange={setPosition}
            options={[
              { value: 'center', label: t('watermark.posCenter') },
              { value: 'right', label: t('watermark.posRight') },
            ]}
          />
          <ChoiceGroup
            legend={t('watermark.styleLabel')}
            value={style}
            onChange={setStyle}
            options={[
              { value: 'simple', label: t('watermark.styleSimple') },
              { value: 'total', label: t('watermark.styleTotal') },
            ]}
          />
        </>
      ) : null}
      {!markReady && !useNumbers ? <p>{t('watermark.pickOne')}</p> : null}
    </ToolWorkspace>
  );
}
