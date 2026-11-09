// Frame for tools that work on typed or pasted text (no file): a card with the tool's controls inside.
import { useI18n } from '../../../shared/i18n/useI18n.js';

export function TextToolShell({ children }) {
  const { t } = useI18n();
  return (
    <section className="workspace workspace-card" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" className="visually-hidden">{t('tool.workspace')}</h2>
      {children}
    </section>
  );
}
