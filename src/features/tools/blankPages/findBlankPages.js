// Finds blank pages of a PDF by drawing small pictures of them. Returns page numbers starting at 0.
import { rasterizePdf } from '../../../shared/lib/rasterizePdf.js';
import { isBlankPixels } from './blankDetect.js';

export async function findBlankPages(bytes, sensitivity, onProgress) {
  const blank = [];
  const draw = (context, used, index, canvas) => {
    if (isBlankPixels(context.getImageData(0, 0, canvas.width, canvas.height).data, sensitivity)) blank.push(index);
  };
  await rasterizePdf(bytes, { scale: 0.6, quality: 0.1, draw }, onProgress);
  return blank;
}
