// Makes a PDF smaller: shrinks big JPG pictures inside it and re-saves the file more tightly.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { yieldToUi } from '../../../shared/lib/yieldToUi.js';

const MIN_SAVING = 0.9; // only swap a picture when the new one is at least 10% smaller

function isJpegImage(lib, dict) {
  const { PDFName, PDFArray } = lib;
  if (dict.lookup(PDFName.of('Subtype')) !== PDFName.of('Image')) return false;
  if (dict.has(PDFName.of('Mask')) || dict.has(PDFName.of('Decode'))) return false;
  if (dict.lookup(PDFName.of('ImageMask'))?.toString() === 'true') return false;
  let filter = dict.lookup(PDFName.of('Filter'));
  if (filter instanceof PDFArray) filter = filter.size() === 1 ? filter.lookup(0) : null;
  if (filter !== PDFName.of('DCTDecode')) return false;
  const space = dict.lookup(PDFName.of('ColorSpace'));
  if (space === PDFName.of('DeviceRGB') || space === PDFName.of('DeviceGray')) return true;
  if (space instanceof PDFArray && space.lookup(0) === PDFName.of('ICCBased')) {
    const parts = space.lookup(1)?.dict?.lookup(PDFName.of('N'));
    const count = parts?.asNumber?.();
    return count === 1 || count === 3;
  }
  return false;
}

// recompress(bytes, { maxSide, quality }) -> { bytes, width, height } or null (skip this picture).
export async function compressPdf(bytes, { recompress, maxSide, quality }, onProgress) {
  const lib = await getPdfLib();
  const { PDFName, PDFRawStream } = lib;
  const doc = await loadPdf(bytes);
  const found = doc.context
    .enumerateIndirectObjects()
    .filter(([, object]) => object instanceof PDFRawStream && isJpegImage(lib, object.dict));

  for (let i = 0; i < found.length; i += 1) {
    const [ref, stream] = found[i];
    const original = stream.getContents();
    const smaller = await recompress(original, { maxSide, quality });
    if (smaller && smaller.bytes.length < original.length * MIN_SAVING) {
      const dict = doc.context.obj({
        Type: 'XObject',
        Subtype: 'Image',
        Width: smaller.width,
        Height: smaller.height,
        ColorSpace: 'DeviceRGB',
        BitsPerComponent: 8,
        Filter: 'DCTDecode',
      });
      const softMask = stream.dict.get(PDFName.of('SMask'));
      if (softMask) dict.set(PDFName.of('SMask'), softMask);
      doc.context.assign(ref, PDFRawStream.of(dict, smaller.bytes));
    }
    onProgress?.(((i + 1) / found.length) * 90);
    await yieldToUi();
  }
  const saved = await doc.save({ useObjectStreams: true });
  onProgress?.(100);
  return { bytes: saved, imageCount: found.length };
}
