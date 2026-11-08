// Three short promises with ticks: works in the browser, no account, free.
import { useI18n } from '../i18n/useI18n.js';
import { Icon } from './Icon.jsx';

export function TrustRow() {
  const { t } = useI18n();
  return (
    <ul className="trust-row">
      {['trust.browser', 'trust.noLogin', 'trust.free'].map((key) => (
        <li key={key}><Icon name="check" size={18} />{t(key)}</li>
      ))}
    </ul>
  );
}
