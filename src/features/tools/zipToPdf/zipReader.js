// Reads the pictures out of a zip file. Other files in the zip are skipped.
import { listEntries, unpackEntries, zipFail } from '../../../shared/lib/zipRead.js';

const MAX_IMAGES = 200;

export { unzipSupported } from '../../../shared/lib/zipRead.js';

const isPicture = (name) => {
  const base = name.split('/').pop();
  return !name.startsWith('__MACOSX/') && !base.startsWith('.') && /\.(jpe?g|png)$/i.test(base);
};

// Returns { images: [{ name, bytes }] in natural name order, skipped: number of other files }.
export async function readZipImages(bytes) {
  const all = listEntries(bytes).filter((entry) => !entry.name.endsWith('/'));
  const pictures = all.filter((entry) => isPicture(entry.name));
  if (pictures.length === 0) throw zipFail('error.zipEmpty');
  if (pictures.length > MAX_IMAGES) throw zipFail('error.tooMany');
  pictures.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  return { images: await unpackEntries(bytes, pictures), skipped: all.length - pictures.length };
}
