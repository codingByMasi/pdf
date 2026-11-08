// Grid of page pictures, each with turn buttons and (if allowed) move and remove buttons.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { PageThumb } from '../../../shared/ui/PageThumb.jsx';

export function PageEditGrid({ edits, urls, disabled, allowMove, allowRemove, onTurn, onMove, onRemove }) {
  const { t } = useI18n();
  return (
    <ul className="page-grid">
      {edits.map((edit, position) => {
        const n = edit.index + 1;
        return (
          <li key={edit.index} className="page-card">
            <PageThumb url={urls[edit.index]} number={n} rotation={edit.rotation} dimmed={edit.removed} />
            <div className="page-card-actions">
              <Button variant="light" disabled={disabled} aria-label={t('rotate.left', { n })} onClick={() => onTurn(position, -90)}>⟲</Button>
              <Button variant="light" disabled={disabled} aria-label={t('rotate.right', { n })} onClick={() => onTurn(position, 90)}>⟳</Button>
              {allowMove ? (
                <>
                  <Button variant="light" disabled={disabled || position === 0} aria-label={t('rotate.earlier', { n })} onClick={() => onMove(position, -1)}>◀</Button>
                  <Button variant="light" disabled={disabled || position === edits.length - 1} aria-label={t('rotate.later', { n })} onClick={() => onMove(position, 1)}>▶</Button>
                </>
              ) : null}
            </div>
            {allowRemove ? (
              <label className="choice">
                <input type="checkbox" checked={edit.removed} disabled={disabled} onChange={() => onRemove(position)} />
                <span>{t('delete.pageCheck', { n })}</span>
              </label>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
