// Hash / checksum screen: fingerprints of a file or of typed text, and a box to check them against a known one.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { FilePick } from '../textKit/FilePick.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { ALGORITHMS, MAX_BYTES, hashBytes, sameHash } from './hashes.js';

export default function HashTool() {
  const { t } = useI18n();
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState(null);
  const [error, setError] = useState('');
  const [expected, setExpected] = useState('');

  useEffect(() => {
    let live = true;
    setError('');
    setHashes(null);
    (async () => {
      if (!window.crypto?.subtle) return setError('hash.unsupported');
      let bytes;
      if (mode === 'file') {
        if (!file) return;
        if (file.size > MAX_BYTES) return setError('error.tooBig');
        bytes = new Uint8Array(await file.arrayBuffer());
      } else {
        if (!text) return;
        bytes = new TextEncoder().encode(text);
      }
      const out = {};
      for (const a of ALGORITHMS) out[a] = await hashBytes(bytes, a);
      if (live) setHashes(out);
    })().catch(() => live && setError('error.generic'));
    return () => { live = false; };
  }, [mode, file, text]);

  const match = hashes && expected.trim() ? Object.values(hashes).some((h) => sameHash(h, expected)) : null;
  return (
    <TextToolShell>
      <ChoiceGroup legend={t('hash.mode')} value={mode} onChange={setMode} options={[{ value: 'file', label: t('hash.file') }, { value: 'text', label: t('hash.text') }]} />
      {mode === 'file' ? <FilePick file={file} onPick={setFile} /> : <TextField label={t('hash.textLabel')} multiline rows={4} value={text} onChange={(e) => setText(e.target.value)} spellCheck="false" />}
      {error ? <StatusMessage title={t('error.heading')}>{t(error)}</StatusMessage> : null}
      {hashes ? (
        <dl className="hash-list">
          {ALGORITHMS.map((a) => <div key={a}><dt>{a}</dt><dd>{hashes[a]}</dd></div>)}
        </dl>
      ) : null}
      <TextField label={t('hash.expected')} value={expected} onChange={(e) => setExpected(e.target.value)} spellCheck="false" />
      {match === true ? <p role="status" className="match-ok">{t('hash.same')}</p> : match === false ? <p role="alert">{t('hash.different')}</p> : null}
      <p className="field-hint">{t('hash.note')}</p>
    </TextToolShell>
  );
}
