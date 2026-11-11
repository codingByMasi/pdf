// Typing speed test screen: type a short passage in English or Hindi and see speed and accuracy.
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ResultGrid } from '../calcKit/ResultGrid.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { passages } from './passages.js';
import { letterStates, typingStats } from './typingStats.js';

export default function TypingTestTool() {
  const { t } = useI18n();
  const [language, setLanguage] = useState('en');
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const box = useRef(null);
  const target = passages[language][index % passages[language].length];
  const done = typed.length >= target.length;

  useEffect(() => {
    if (!startedAt || done) return undefined;
    const id = setInterval(() => setSeconds((Date.now() - startedAt) / 1000), 250);
    return () => clearInterval(id);
  }, [startedAt, done]);

  function change(value) {
    if (done) return;
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value.slice(0, target.length));
    if (value.length >= target.length) setSeconds((Date.now() - (startedAt ?? Date.now())) / 1000);
  }
  function reset(nextLanguage = language, nextIndex = index) {
    setLanguage(nextLanguage);
    setIndex(nextIndex);
    setTyped('');
    setStartedAt(null);
    setSeconds(0);
    box.current?.focus();
  }
  const stats = typingStats(target, typed, seconds || 1);
  const states = letterStates(target, typed);
  return (
    <TextToolShell>
      <ChoiceGroup legend={t('typing.language')} value={language} onChange={(v) => reset(v, 0)} options={[{ value: 'en', label: t('typing.en') }, { value: 'hi', label: t('typing.hi') }]} />
      {language === 'hi' ? <p className="field-hint">{t('typing.hiHint')}</p> : null}
      <p className="typing-passage" lang={language} aria-label={t('typing.passage')}>
        {[...target].map((ch, i) => <span key={i} className={`typing-${states[i]}${i === typed.length ? ' typing-now' : ''}`}>{ch}</span>)}
      </p>
      <label className="field">
        <span className="field-label">{t('typing.box')}</span>
        <textarea ref={box} lang={language} rows={3} value={typed} onChange={(e) => change(e.target.value)} disabled={done} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
      </label>
      <ResultGrid items={[{ label: t('typing.wpm'), value: startedAt ? String(stats.wpm) : '–' }, { label: t('typing.accuracy'), value: `${stats.accuracy}%` }, { label: t('typing.time'), value: `${Math.floor(seconds)} s` }]} />
      {done ? <p role="status">{t('typing.done')}</p> : null}
      <div className="editor-actions">
        <Button onClick={() => reset(language, index)}>{t('typing.again')}</Button>
        <Button variant="secondary" onClick={() => reset(language, index + 1)}>{t('typing.next')}</Button>
      </div>
    </TextToolShell>
  );
}
