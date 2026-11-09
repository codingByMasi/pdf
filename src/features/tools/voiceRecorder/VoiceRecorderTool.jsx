// Voice Recorder screen: records from the microphone and gives a sound file. Nothing is uploaded.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { RecorderPanel } from '../recorderKit/RecorderPanel.jsx';
import { canRecord, useRecorder } from '../recorderKit/useRecorder.js';

export default function VoiceRecorderTool() {
  const { t } = useI18n();
  const rec = useRecorder('audio');
  return (
    <RecorderPanel kind="audio" rec={rec} supported={canRecord()} fileBase="voice-recording"
      getStream={() => navigator.mediaDevices.getUserMedia({ audio: true })}>
      <p className="field-hint">{t('rec.hint.audio')}</p>
    </RecorderPanel>
  );
}
