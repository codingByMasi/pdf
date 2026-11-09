// Highlight Words screen: type a word and every place it appears in the PDF gets a yellow highlight.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { drawMarks, findAllMarks } from './useTextMarks.js';

export default function HighlightTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [word, setWord] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const marks = await findAllMarks(file, word.trim(), { matchCase }, onProgress);
      const out = await drawMarks(file, marks, 'highlight', '', onProgress);
      return { blob: new Blob([out.bytes], { type: 'application/pdf' }), fileName: outputName(file.name, '-highlighted'), noteKey: 'marks.highlighted', noteVars: { count: out.count } };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: info.errorKey }} hasFiles={Boolean(file) && info.status !== 'error'} action={{ labelKey: 'run.highlightText', enabled: info.status === 'ready' && word.trim() !== '', onRun: run }}>
      <TextField label={t('marks.find')} hint={t('marks.hint')} value={word} onChange={(e) => setWord(e.target.value)} />
      <label className="choice"><input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} /><span>{t('marks.matchCase')}</span></label>
    </ToolWorkspace>
  );
}
