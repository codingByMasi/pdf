// A grip button: press and drag it to move an item. The arrow buttons next to it do the same with a keyboard.
import { useI18n } from '../i18n/useI18n.js';
import { Icon } from './Icon.jsx';

export function DragHandle({ name, disabled, ...pointerProps }) {
  const { t } = useI18n();
  return (
    <button type="button" className="icon-button drag-handle" disabled={disabled} aria-label={t('reorder.drag', { name })} {...pointerProps}>
      <Icon name="grip" size={20} />
    </button>
  );
}
