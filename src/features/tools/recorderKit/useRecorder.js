// Records a live stream (microphone or screen) with the browser's MediaRecorder and gives back one file.
import { useCallback, useEffect, useRef, useState } from 'react';

const TYPES = {
  audio: ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'],
  video: ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'],
};

export const canRecord = () => typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && Boolean(navigator.mediaDevices);
export const canShareScreen = () => canRecord() && typeof navigator.mediaDevices.getDisplayMedia === 'function';

export function pickType(kind) {
  return TYPES[kind].find((type) => MediaRecorder.isTypeSupported?.(type)) ?? '';
}

// Returns { state: 'idle' | 'recording' | 'done', seconds, result: { blob, url, ext } | null, errorKey, start(getStream), stop(), reset() }.
export function useRecorder(kind) {
  const [state, setState] = useState('idle');
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [errorKey, setErrorKey] = useState('');
  const recorder = useRef(null);
  const stream = useRef(null);
  const timer = useRef(null);

  const cleanup = useCallback(() => {
    clearInterval(timer.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);
  useEffect(() => () => { cleanup(); }, [cleanup]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const start = useCallback(async (getStream) => {
    setErrorKey('');
    setResult(null);
    try {
      stream.current = await getStream();
    } catch (error) {
      setErrorKey(error?.name === 'NotAllowedError' || error?.name === 'SecurityError' ? 'rec.denied' : 'rec.failed');
      return;
    }
    try {
      const type = pickType(kind);
      const rec = new MediaRecorder(stream.current, type ? { mimeType: type } : undefined);
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        cleanup();
        const mime = rec.mimeType || type || (kind === 'audio' ? 'audio/webm' : 'video/webm');
        const blob = new Blob(chunks, { type: mime });
        setResult({ blob, url: URL.createObjectURL(blob), ext: /mp4/.test(mime) ? (kind === 'audio' ? 'm4a' : 'mp4') : /ogg/.test(mime) ? 'ogg' : 'webm' });
        setState('done');
      };
      stream.current.getVideoTracks().forEach((track) => track.addEventListener('ended', () => { if (rec.state !== 'inactive') rec.stop(); }));
      rec.start(1000);
      recorder.current = rec;
      setSeconds(0);
      setState('recording');
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      cleanup();
      setErrorKey('rec.failed');
    }
  }, [kind, cleanup]);

  const stop = useCallback(() => { if (recorder.current && recorder.current.state !== 'inactive') recorder.current.stop(); }, []);
  const reset = useCallback(() => { setResult(null); setState('idle'); setSeconds(0); }, []);
  return { state, seconds, result, errorKey, start, stop, reset };
}

export const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
