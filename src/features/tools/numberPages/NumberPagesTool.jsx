// Number Pages screen: choose where the numbers go and how they look, then save a numbered PDF.
import { useState } from 'react';
import { usePref } from '../../../shared/lib/usePref.js';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { runTask } from '../worker/runTask.js';

export default function NumberPagesTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [vertical, setVertical] = usePref('numbers.vertical', 'bottom');
  const [horizontal, setHorizontal] = usePref('numbers.horizontal', 'center');
  const [style, setStyle] = usePref('numbers.style', 'simple');
  const [digits, setDigits] = usePref('numbers.digits', 'latin');
  const [start, setStart] = useState('1');
  const [skipFirst, setSkipFirst] = useState(false);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);
  const startNumber = Number(start);
  const startOk = start.trim() !== '' && Number.isInteger(startNumber) && startNumber >= 0 && startNumber <= 99999;

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const options = { vertical, horizontal, style, start: startNumber, skipFirst, digits };
      const data = await runTask('numberPages', { bytes, options }, { onProgress });
      return { blob: new Blob([data], { type: 'application/pdf' }), fileName: outputName(file.name, '-numbered') };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={{ key: info.errorKey }}
      hasFiles={Boolean(file) && info.status !== 'error'}
      action={{ labelKey: 'run.numberPages', enabled: info.status === 'ready' && startOk, onRun: run }}
    >
      <ChoiceGroup
        legend={t('numbers.verticalLabel')}
        value={vertical}
        onChange={setVertical}
        options={[
          { value: 'bottom', label: t('numbers.bottom') },
          { value: 'top', label: t('numbers.top') },
        ]}
      />
      <ChoiceGroup
        legend={t('numbers.horizontalLabel')}
        value={horizontal}
        onChange={setHorizontal}
        options={[
          { value: 'left', label: t('numbers.left') },
          { value: 'center', label: t('numbers.center') },
          { value: 'right', label: t('numbers.right') },
        ]}
      />
      <ChoiceGroup
        legend={t('numbers.styleLabel')}
        value={style}
        onChange={setStyle}
        options={[
          { value: 'simple', label: t('numbers.styleSimple') },
          { value: 'total', label: t('numbers.styleTotal') },
        ]}
      />
      <ChoiceGroup
        legend={t('numbers.digitsLabel')}
        value={digits}
        onChange={setDigits}
        options={['latin', 'hindi', 'roman'].map((v) => ({ value: v, label: t(`numbers.digits.${v}`) }))}
      />
      <TextField
        label={t('numbers.startLabel')}
        type="number"
        inputMode="numeric"
        min="0"
        max="99999"
        value={start}
        onChange={(event) => setStart(event.target.value)}
      />
      {startOk ? null : <p role="alert">{t('numbers.startBad')}</p>}
      <label className="choice">
        <input type="checkbox" checked={skipFirst} onChange={(event) => setSkipFirst(event.target.checked)} />
        <span>{t('numbers.skipFirst')}</span>
      </label>
    </ToolWorkspace>
  );
}
