// After the build: when a publisher id is set, writes ads.txt and opens the security rules just enough for Google's AdSense script. Does nothing without an id.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../src/config.js';

// Check these against Google's AdSense security-policy page before going live; Google may change them.
export const AD_SOURCES = {
  'script-src': ['https://pagead2.googlesyndication.com', 'https://partner.googleadservices.com', 'https://tpc.googlesyndication.com', 'https://www.googletagservices.com', 'https://fundingchoicesmessages.google.com', 'https://*.adtrafficquality.google', 'https://www.google.com'],
  'frame-src': ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com', 'https://*.googlesyndication.com', 'https://fundingchoicesmessages.google.com', 'https://*.adtrafficquality.google', 'https://www.google.com'],
  'img-src': ['https:'],
  'connect-src': ['https://pagead2.googlesyndication.com', 'https://*.googlesyndication.com', 'https://*.doubleclick.net', 'https://fundingchoicesmessages.google.com', 'https://*.adtrafficquality.google', 'https://*.google.com'],
  'style-src': ["'unsafe-inline'"],
};

// publisherId looks like "ca-pub-1234567890123456".
export function buildAdsTxt(publisherId) {
  const id = String(publisherId).replace(/^ca-/, '');
  return `google.com, ${id}, DIRECT, f08c47fec0942fa0\n`;
}

export function isValidPublisherId(id) {
  return /^ca-pub-\d{10,20}$/.test(String(id));
}

// Adds the ad sources to a Content-Security-Policy value (a "; "-separated list of rules).
export function addAdSources(csp) {
  const rules = csp.split(';').map((r) => r.trim()).filter(Boolean);
  const out = rules.map((rule) => {
    const [name, ...values] = rule.split(/\s+/);
    const extra = AD_SOURCES[name];
    return extra ? [name, ...values, ...extra.filter((e) => !values.includes(e))].join(' ') : rule;
  });
  return out.join('; ');
}

export function adsHeaders(headersText) {
  return headersText.replace(/(Content-Security-Policy:\s*)([^\n]+)/, (_, label, csp) => `${label}${addAdSources(csp)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const { enabled, publisherId } = config.ads;
  if (enabled && !isValidPublisherId(publisherId)) {
    throw new Error('Ads are on but config.ads.publisherId is missing or wrong (it looks like ca-pub-1234567890123456).');
  } else if (!isValidPublisherId(publisherId)) {
    console.log('No publisher id: no ads.txt, security rules unchanged');
  } else {
    writeFileSync(join(dist, 'ads.txt'), buildAdsTxt(publisherId));
    const file = join(dist, '_headers');
    writeFileSync(file, adsHeaders(readFileSync(file, 'utf8')));
    console.log(`Publisher id set (ads ${enabled ? 'on' : 'off'}): wrote ads.txt and opened the security rules for the Google script`);
  }
}
