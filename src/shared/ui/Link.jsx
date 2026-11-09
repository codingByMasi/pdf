// Link that changes page without reloading, but still works with new-tab clicks.
import { useI18n } from '../i18n/useI18n.js';
import { localize, navigate } from '../lib/router.js';

export function Link({ to, children, onClick: extraClick, ...rest }) {
  const { lang } = useI18n();
  const href = localize(lang, to);
  function onClick(event) {
    if (extraClick) extraClick(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  }
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
