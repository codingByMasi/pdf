// Compare PDFs screen: add two PDFs and see, page by page, which words were added or removed.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { extractPageTexts } from '../../../shared/lib/pdfText.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { comparePages } from './diffWords.js';

const SHOWN = 40;

function buildReport(changes, names, t) {
  const lines = [`${names[0]}  <->  ${names[1]}`, ''];
  for (const c of changes) {
    lines.push(t('compare.pageLine', { page: c.page }));
    if (c.removed.length) lines.push(`  - ${c.removed.join(' ')}`);
    if (c.added.length) lines.push(`  + ${c.added.join(' ')}`);
    lines.push('');
  }
  return lines.join('\n');
}

export default function CompareTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [changes, setChanges] = useState(null);
  const two = selection.items.length === 2;

  function run() {
    setChanges(null);
    job.run(async (onProgress) => {
      const [first, second] = selection.items.map((item) => item.file);
      const a = await extractPageTexts(first, (p) => onProgress(p / 2));
      const b = await extractPageTexts(second, (p) => onProgress(50 + p / 2));
      const found = comparePages(a, b);
      setChanges({ list: found, empty: a.join('').trim() === '' || b.join('').trim() === '' });
      const blob = new Blob([buildReport(found, [first.name, second.name], t)], { type: 'text/plain;charset=utf-8' });
      return { blob, fileName: 'compare-report.txt' };
    });
  }

  return (
    <ToolWorkspace
      tool={tool}
      selection={selection}
      job={job}
      error={selection.items.length > 2 ? { key: 'error.compareTwo' } : undefined}
      hasFiles={selection.items.length > 0}
      reorderable
      action={{ labelKey: 'run.compare', enabled: two, onRun: run }}
    >
      <p>{t('compare.hint')}</p>
      {changes ? (
        <section aria-live="polite">
          <h3>{changes.list.length === 0 ? t('compare.same') : t('compare.changed', { count: changes.list.length })}</h3>
          {changes.empty ? <p>{t('compare.noText')}</p> : null}
          <ul className="compare-list">
            {changes.list.map((c) => (
              <li key={c.page}>
                <strong>{t('compare.pageLine', { page: c.page })}</strong>
                {c.onlyIn ? <span> {t(`compare.only.${c.onlyIn}`)}</span> : null}
                {c.removed.length ? <p className="compare-removed">− {c.removed.slice(0, SHOWN).join(' ')}{c.removed.length > SHOWN ? ' …' : ''}</p> : null}
                {c.added.length ? <p className="compare-added">+ {c.added.slice(0, SHOWN).join(' ')}{c.added.length > SHOWN ? ' …' : ''}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </ToolWorkspace>
  );
}
