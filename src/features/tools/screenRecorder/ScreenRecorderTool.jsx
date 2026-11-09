// Screen Recorder screen: records your screen, a window or a tab (and optionally sound) into a video file.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { RecorderPanel } from '../recorderKit/RecorderPanel.jsx';
import { canShareScreen, useRecorder } from '../recorderKit/useRecorder.js';

export default function ScreenRecorderTool() {
  const { t } = useI18n();
  const rec = useRecorder('video');
  const [sound, setSound] = useState(false);
  return (
    <RecorderPanel kind="video" rec={rec} supported={canShareScreen()} fileBase="screen-recording"
      getStream={async () => {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        if (!sound) return screen;
        try {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
          return new MediaStream([...screen.getVideoTracks(), ...(screen.getAudioTracks().length ? screen.getAudioTracks() : mic.getAudioTracks())]);
        } catch {
          return screen;
        }
      }}>
      <p className="field-hint">{t('rec.hint.video')}</p>
      <label className="choice"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /><span>{t('rec.mic')}</span></label>
    </RecorderPanel>
  );
}
