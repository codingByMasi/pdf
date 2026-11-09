// Markdown Preview screen: type or paste Markdown and see how it looks. Shows simple Markdown only.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { InputBox } from '../textKit/InputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { markdownToBlocks } from '../markdownToPdf/markdownBlocks.js';
import { MarkdownView } from './MarkdownView.jsx';

export default function MarkdownPreviewTool() {
  const { t } = useI18n();
  const [text, setText] = useState('# Hello\n\nWrite **Markdown** here.\n\n- one\n- two\n');
  const { blocks, skippedImages } = useMemo(() => markdownToBlocks(text), [text]);
  return (
    <TextToolShell>
      <InputBox label={t('md.input')} value={text} onChange={setText} rows={10} />
      <h3>{t('md.preview')}</h3>
      <div className="md-box" aria-live="polite"><MarkdownView blocks={blocks} /></div>
      <p className="field-hint">{t('md.limits')}{skippedImages ? ` ${t('md.images', { count: skippedImages })}` : ''}</p>
    </TextToolShell>
  );
}
