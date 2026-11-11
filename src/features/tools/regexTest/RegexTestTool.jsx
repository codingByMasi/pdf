// Regex Tester screen: type a pattern and a text, and see the matches. A slow pattern is stopped after 2 seconds.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';

const FLAGS = ['i', 'm', 's', 'u'];
const LIMIT_MS = 2000;

export default function RegexTestTool() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState(['i']);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(null);
    if (!pattern) return undefined;
    let worker;
    let timer;
    try {
      worker = new Worker(new URL('./regexWorker.js', import.meta.url), { type: 'module' });
    } catch {
      setResult({ ok: false, message: t('regex.noWorker') });
      return undefined;
    }
    const wait = setTimeout(() => {
      timer = setTimeout(() => { worker.terminate(); setResult({ ok: false, message: t('regex.slow') }); }, LIMIT_MS);
      worker.onmessage = (event) => { clearTimeout(timer); setResult(event.data); };
      worker.postMessage({ pattern, flags: flags.join(''), text: text.slice(0, 100000) });
    }, 200);
    return () => { clearTimeout(wait); clearTimeout(timer); worker.terminate(); };
  }, [pattern, flags, text]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (f) => setFlags(flags.includes(f) ? flags.filter((x) => x !== f) : [...flags, f]);
  return (
    <TextToolShell>
      <TextField label={t('regex.pattern')} value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck="false" />
      <fieldset className="choice-group"><legend>{t('regex.flags')}</legend>
        {FLAGS.map((f) => <label key={f} className="choice"><input type="checkbox" checked={flags.includes(f)} onChange={() => toggle(f)} /><span>{t(`regex.flag.${f}`)}</span></label>)}
      </fieldset>
      <TextField label={t('regex.text')} multiline rows={6} value={text} onChange={(e) => setText(e.target.value)} spellCheck="false" />
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{result.message}</StatusMessage> : null}
      {result?.ok ? (
        <section aria-live="polite">
          <p>{t('regex.count', { count: result.matches.length })}{result.more ? ` ${t('regex.more')}` : ''}</p>
          <ol className="match-list">
            {result.matches.map((m, i) => (
              <li key={i}><code>{m.text === '' ? t('regex.empty') : m.text}</code> <span className="field-hint">{t('regex.at', { index: m.index })}</span>
                {m.groups.length ? <ul>{m.groups.map((g, j) => <li key={j}>{t('regex.group', { n: j + 1 })}: <code>{g ?? '–'}</code></li>)}</ul> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </TextToolShell>
  );
}
