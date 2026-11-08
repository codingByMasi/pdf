// Builds a PDF where chosen pages are replaced by pictures and all other pages are kept as they are.
import { createPdf, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

// rasters: [{ index, bytes (JPEG), width, height }] with page numbers from 0 and sizes in points.
export async function replacePages(bytes, rasters, onProgress) {
  const source = await loadPdf(bytes);
  const out = await createPdf();
  const byIndex = new Map(rasters.map((r) => [r.index, r]));
  const count = source.getPageCount();
  for (let i = 0; i < count; i += 1) {
    const raster = byIndex.get(i);
    if (raster) {
      const image = await out.embedJpg(raster.bytes);
      out.addPage([raster.width, raster.height]).drawImage(image, { x: 0, y: 0, width: raster.width, height: raster.height });
    } else {
      const [page] = await out.copyPages(source, [i]);
      out.addPage(page);
    }
    onProgress?.(((i + 1) / count) * 100);
    if (i % 10 === 9) await yieldToUi();
  }
  return out.save();
}
