// Progress bar for long jobs. Leave value empty when the time is unknown.
import { useI18n } from '../i18n/useI18n.js';

export function ProgressBar({ value }) {
  const { t } = useI18n();
  const known = typeof value === 'number';
  const percent = known ? Math.max(0, Math.min(100, Math.round(value))) : undefined;
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-label={t('progress.label')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className={`progress-fill${known ? '' : ' progress-unknown'}`}
          style={known ? { width: `${percent}%` } : undefined}
        />
      </div>
      <p className="progress-text">{known ? `${percent}%` : t('progress.wait')}</p>
    </div>
  );
}
