// Text to Speech screen: reads text aloud with the voices already on the device. Nothing is sent anywhere.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export default function SpeechTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState('1');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!supported) return undefined;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => { window.speechSynthesis.removeEventListener?.('voiceschanged', load); window.speechSynthesis.cancel(); };
  }, []);

  if (!supported) return <TextToolShell><StatusMessage title={t('error.heading')}>{t('speech.none')}</StatusMessage></TextToolShell>;

  const play = () => {
    window.speechSynthesis.cancel();
    const talk = new SpeechSynthesisUtterance(text);
    const chosen = voices.find((v) => v.voiceURI === voice);
    if (chosen) { talk.voice = chosen; talk.lang = chosen.lang; }
    talk.rate = Math.max(0.5, Math.min(2, Number(rate) || 1));
    talk.onend = () => setSpeaking(false);
    talk.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(talk);
  };
  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  return (
    <TextToolShell>
      <InputBox label={t('speech.input')} value={text} onChange={setText} rows={8} />
      <div className="field">
        <label className="field-label" htmlFor="speech-voice">{t('speech.voice')}</label>
        <select id="speech-voice" className="field-input" value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="">{t('speech.default')}</option>
          {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
        </select>
      </div>
      <TextField label={t('speech.rate')} type="number" inputMode="decimal" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      <div className="editor-actions">
        <Button disabled={!text.trim() || speaking} onClick={play}>{t('run.speech')}</Button>
        <Button variant="secondary" disabled={!speaking} onClick={stop}>{t('speech.stop')}</Button>
      </div>
      <p className="field-hint">{t('speech.note')}</p>
    </TextToolShell>
  );
}
