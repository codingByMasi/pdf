// Video Frame Grabber screen: pick a moment in a video and save that picture as PNG. The video never leaves the device.
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, makeCanvas } from '../../../shared/lib/imageIO.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';

const STEPS = [-1, -0.1, 0.1, 1];

export default function VideoFrameTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const video = useRef(null);
  const [url, setUrl] = useState(null);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!file) { setUrl(null); return undefined; }
    const made = URL.createObjectURL(file);
    setUrl(made);
    setFailed(false);
    setTime(0);
    return () => URL.revokeObjectURL(made);
  }, [file]);

  const nudge = (seconds) => {
    const el = video.current;
    if (!el) return;
    el.pause();
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seconds));
  };
  const save = async () => {
    const el = video.current;
    const canvas = makeCanvas(el.videoWidth, el.videoHeight);
    canvas.getContext('2d').drawImage(el, 0, 0);
    const saved = await canvasToFile(canvas, 'png');
    return { blob: saved.blob, fileName: outputName(file.name, `-${time.toFixed(1)}s`, saved.ext), noteKey: 'videoframe.done', noteVars: { time: time.toFixed(1) } };
  };

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={failed ? { key: 'videoframe.bad' } : null} hasFiles={Boolean(file)}
      action={{ labelKey: 'run.videoFrame', enabled: Boolean(url) && !failed, onRun: () => job.run(save) }}>
      {url ? (
        <>
          <p className="field-hint">{t('videoframe.hint')}</p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={video} src={url} controls playsInline preload="auto" className="image-preview" aria-label={t('videoframe.alt')}
            onError={() => setFailed(true)} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onSeeked={(e) => setTime(e.currentTarget.currentTime)} />
          <p>{t('videoframe.time', { time: time.toFixed(1) })}</p>
          <div className="editor-actions">
            {STEPS.map((s) => <Button key={s} variant="secondary" onClick={() => nudge(s)}>{s > 0 ? '+' : '−'}{Math.abs(s)} {t('videoframe.sec')}</Button>)}
          </div>
        </>
      ) : null}
    </ToolWorkspace>
  );
}
