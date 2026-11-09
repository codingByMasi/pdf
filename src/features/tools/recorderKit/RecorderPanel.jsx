// Screen for recorders: start and stop buttons, a running clock, a preview and a download link.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { clock } from './useRecorder.js';

export function RecorderPanel({ kind, rec, supported, getStream, fileBase, children }) {
  const { t } = useI18n();
  if (!supported) return <TextToolShell><StatusMessage title={t('error.heading')}>{t(`rec.unsupported.${kind}`)}</StatusMessage></TextToolShell>;
  return (
    <TextToolShell>
      {children}
      {rec.errorKey ? <StatusMessage title={t('error.heading')}>{t(rec.errorKey)}</StatusMessage> : null}
      {rec.state === 'idle' ? <Button onClick={() => rec.start(getStream)}>{t(`rec.start.${kind}`)}</Button> : null}
      {rec.state === 'recording' ? (
        <>
          <p className="rec-clock" role="timer" aria-live="off">● {t('rec.recording')} {clock(rec.seconds)}</p>
          <Button onClick={rec.stop}>{t('rec.stop')}</Button>
        </>
      ) : null}
      {rec.state === 'done' && rec.result ? (
        <div className="download" role="status">
          <h3 className="download-ready">{t('rec.ready', { time: clock(rec.seconds) })}</h3>
          {kind === 'audio'
            ? <audio controls src={rec.result.url} className="audio-player" aria-label={t('audio.listen')} />
            // eslint-disable-next-line jsx-a11y/media-has-caption
            : <video controls playsInline src={rec.result.url} className="image-preview" aria-label={t('rec.preview')} />}
          <a className="button button-primary" href={rec.result.url} download={`${fileBase}.${rec.result.ext}`}>{t('download.button')}</a>
          <button type="button" className="text-button" onClick={rec.reset}>{t('rec.again')}</button>
        </div>
      ) : null}
    </TextToolShell>
  );
}
