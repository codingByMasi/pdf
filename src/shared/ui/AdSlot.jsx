// Place for an advert. Shows nothing while ads are switched off in config.js.
import { config } from '../../config.js';

export function AdSlot({ name }) {
  if (!config.ads.enabled) return null;
  return <aside className="ad-slot" data-slot={name} aria-hidden="true" />;
}
