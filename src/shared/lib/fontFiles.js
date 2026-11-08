// Finds and downloads the font files (Latin and Hindi, normal and bold). They load only when a tool needs them.
import devaBold from '../../assets/fonts/devanagari-bold.ttf?url';
import devaRegular from '../../assets/fonts/devanagari-regular.ttf?url';
import latinBold from '../../assets/fonts/latin-bold.ttf?url';
import latinRegular from '../../assets/fonts/latin-regular.ttf?url';

const URLS = {
  regular: { latin: latinRegular, deva: devaRegular },
  bold: { latin: latinBold, deva: devaBold },
};
const cache = new Map();

// face: 'regular' | 'bold'. script: 'latin' | 'deva'. Returns the font file as a Uint8Array.
export async function loadFontBytes(face, script) {
  const url = URLS[face][script];
  if (!cache.has(url)) {
    const job = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error('font missing');
      return new Uint8Array(await response.arrayBuffer());
    });
    cache.set(url, job);
    job.catch(() => cache.delete(url));
  }
  try {
    return await cache.get(url);
  } catch {
    throw Object.assign(new Error('font failed'), { errorKey: 'error.fontLoad' });
  }
}
