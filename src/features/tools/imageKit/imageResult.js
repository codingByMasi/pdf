// Makes the finished-file record the download button wants, from a picture file and a saved canvas.
import { outputName } from '../../../shared/lib/outputName.js';

export function imageResult(file, suffix, saved, extra = {}) {
  return { blob: saved.blob, fileName: outputName(file.name, suffix, saved.ext), ...extra };
}

// Format to keep for a picture: PNG and WebP stay, everything else becomes JPG (smaller for photos).
export const keepFormat = (format) => (format === 'png' || format === 'webp' ? format : 'jpg');
