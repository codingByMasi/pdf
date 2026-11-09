// Audio Trimmer screen: choose a start and end time, cut that part of a sound file and save it as WAV.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { MAX_MINUTES, encodeWav, sliceChannels } from './wavEncode.js';

async function decode(file) {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) throw Object.assign(new Error('no audio'), { errorKey: 'audio.unsupported' });
  const context = new Context();
  try {
    const bytes = await file.arrayBuffer();
    return await new Promise((resolve, reject) => context.decodeAudioData(bytes, resolve, reject));
  } catch {
    throw Object.assign(new Error('bad audio'), { errorKey: 'audio.bad' });
  } finally {
    context.close?.();
  }
}

export default function AudioTrimTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const [info, setInfo] = useState(null);
  const [errorKey, setErrorKey] = useState('');
  const [start, setStart] = useState('0');
  const [end, setEnd] = useState('');

  useEffect(() => {
    setInfo(null);
    setErrorKey('');
    if (!file) return undefined;
    let cancelled = false;
    decode(file).then((buffer) => {
      if (cancelled) return;
      setInfo({ buffer, duration: buffer.duration, url: URL.createObjectURL(file) });
      setStart('0');
      setEnd(buffer.duration.toFixed(1));
    }, (e) => { if (!cancelled) setErrorKey(e.errorKey ?? 'audio.bad'); });
    return () => { cancelled = true; };
  }, [file]);
  useEffect(() => () => { if (info?.url) URL.revokeObjectURL(info.url); }, [info]);

  const s = Number(start);
  const e = Number(end);
  const valid = info && Number.isFinite(s) && Number.isFinite(e) && s >= 0 && e > s;
  const tooLong = valid && e - s > MAX_MINUTES * 60;
  const run = () => job.run(async () => {
    const { buffer } = info;
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    const cut = sliceChannels(channels, buffer.sampleRate, s, e);
    return { blob: new Blob([encodeWav(cut, buffer.sampleRate)], { type: 'audio/wav' }), fileName: outputName(file.name, '-cut', 'wav'), noteKey: 'audio.done' };
  });

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: errorKey }} hasFiles={Boolean(file) && !errorKey}
      action={{ labelKey: 'run.audioTrim', enabled: Boolean(valid) && !tooLong, onRun: run }}>
      {info ? (
        <>
          <p>{t('audio.length', { seconds: info.duration.toFixed(1) })}</p>
          <audio controls src={info.url} className="audio-player" aria-label={t('audio.listen')} />
          <div className="form-fields">
            <TextField label={t('audio.start')} type="number" inputMode="decimal" min="0" step="0.1" value={start} onChange={(ev) => setStart(ev.target.value)} />
            <TextField label={t('audio.end')} type="number" inputMode="decimal" min="0" step="0.1" value={end} onChange={(ev) => setEnd(ev.target.value)} />
          </div>
          {tooLong ? <p className="field-hint">{t('audio.tooLong', { minutes: MAX_MINUTES })}</p> : null}
          <p className="field-hint">{t('audio.note')}</p>
        </>
      ) : file && !errorKey ? <p>{t('file.reading')}</p> : null}
    </ToolWorkspace>
  );
}
