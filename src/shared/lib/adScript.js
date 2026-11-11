// Loads the Google ad script once, and only when ads are on, set up, and the visitor is online.
import { config } from '../../config.js';

let started = null;

export function adsAvailable() {
  const { enabled, publisherId } = config.ads;
  return Boolean(enabled && publisherId && typeof navigator !== 'undefined' && navigator.onLine !== false);
}

export function loadAdScript() {
  if (!adsAvailable()) return Promise.resolve(false);
  if (started) return started;
  started = new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.async = true;
    tag.crossOrigin = 'anonymous';
    tag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.ads.publisherId)}`;
    tag.onload = () => resolve(true);
    tag.onerror = () => { started = null; resolve(false); };
    document.head.appendChild(tag);
  });
  return started;
}
