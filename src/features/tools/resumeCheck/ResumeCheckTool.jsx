// Resume Checker screen: reads a PDF resume on this device and lists simple, plain checks. No AI, nothing is sent.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { extractPageTexts } from '../../../shared/lib/pdfText.js';
import { friendlyErrorKey } from '../../../shared/lib/friendlyError.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { FilePick } from '../textKit/FilePick.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { checkResume, countFontFamilies } from './checkResume.js';

async function fontNames(bytes) {
  const { PDFName, PDFDict } = await import('pdf-lib');
  const doc = await loadPdf(bytes);
  const names = [];
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFDict && obj.get(PDFName.of('Type')) === PDFName.of('Font') && obj.get(PDFName.of('Subtype')) !== PDFName.of('Type0')) {
      const base = obj.get(PDFName.of('BaseFont'));
      if (base) names.push(String(base).replace(/^\//, ''));
    }
  }
  return { names, pages: doc.getPageCount() };
}

export default function ResumeCheckTool() {
  const { t } = useI18n();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function pick(f) {
    setFile(f);
    setResult(null);
    setError('');
    if (!f) return;
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const [texts, info] = await Promise.all([extractPageTexts(f), fontNames(bytes)]);
      setResult(checkResume({ text: texts.join('\n'), pages: info.pages, fonts: countFontFamilies(info.names) }));
    } catch (e) {
      setError(friendlyErrorKey(e));
    }
  }

  return (
    <TextToolShell>
      <p className="field-hint">{t('resume.hint')}</p>
      <FilePick file={file} accept="application/pdf,.pdf" onPick={pick} />
      {error ? <StatusMessage title={t('error.heading')}>{t(error)}</StatusMessage> : null}
      {result ? (
        <>
          <p>{t('resume.summary', { words: result.words, pages: result.pages, fonts: result.fonts })}</p>
          <ul className="check-list">
            {result.checks.map((c) => <li key={c.id} className={c.ok ? 'check-ok' : 'check-bad'}><strong>{c.ok ? t('resume.ok') : t('resume.fix')}</strong> {t(`resume.tip.${c.id}.${c.ok ? 'ok' : 'bad'}`)}</li>)}
          </ul>
          <p className="field-hint">{t('resume.note')}</p>
        </>
      ) : null}
    </TextToolShell>
  );
}
