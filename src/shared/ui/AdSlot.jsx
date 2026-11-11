// Place for an advert. Shows nothing while ads are off, not set up, or the visitor is offline.
import { useEffect, useRef } from 'react';
import { config } from '../../config.js';
import { adsAvailable, loadAdScript } from '../lib/adScript.js';

export function AdSlot({ name }) {
  const slot = config.ads.slots?.[name];
  const ready = adsAvailable() && Boolean(slot);
  const asked = useRef(false);
  useEffect(() => {
    if (!ready || asked.current) return;
    asked.current = true;
    loadAdScript().then((ok) => {
      if (!ok) return;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* the advert simply does not show */ }
    });
  }, [ready]);
  if (!ready) return null;
  return (
    <aside className="ad-slot" data-slot={name} aria-label="Advert">
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={config.ads.publisherId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
