// Link that changes page without reloading, but still works with new-tab clicks.
import { navigate } from '../lib/router.js';

export function Link({ to, children, onClick: extraClick, ...rest }) {
  function onClick(event) {
    if (extraClick) extraClick(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }
  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
