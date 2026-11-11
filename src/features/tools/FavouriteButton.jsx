// Star button on a tool page: add or remove the tool from your favourites (kept on this device).
import { useI18n } from '../../shared/i18n/useI18n.js';
import { useToolMemory } from '../../shared/lib/toolMemory.js';
import { Icon } from '../../shared/ui/Icon.jsx';

export function FavouriteButton({ toolId }) {
  const { t } = useI18n();
  const { favourites, toggleFavourite } = useToolMemory();
  const on = favourites.includes(toolId);
  return (
    <button type="button" className="fav-button" aria-pressed={on} onClick={() => toggleFavourite(toolId)}>
      <Icon name="star" size={18} /> {t(on ? 'fav.remove' : 'fav.add')}
    </button>
  );
}
