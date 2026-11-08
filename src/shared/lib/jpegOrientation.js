// Reads the "which way is up" number (1 to 8) that phones store inside JPG photos.
export function jpegOrientation(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return 1;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return 1;
    const marker = bytes[offset + 1];
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1 && offset + 10 <= bytes.length && view.getUint32(offset + 4) === 0x45786966) {
      const tiff = offset + 10;
      const little = view.getUint16(tiff) === 0x4949;
      const entries = view.getUint16(tiff + view.getUint32(tiff + 4, little), little);
      for (let i = 0; i < entries; i += 1) {
        const entry = tiff + view.getUint32(tiff + 4, little) + 2 + i * 12;
        if (entry + 10 > bytes.length) return 1;
        if (view.getUint16(entry, little) === 0x0112) {
          const value = view.getUint16(entry + 8, little);
          return value >= 1 && value <= 8 ? value : 1;
        }
      }
      return 1;
    }
    if (marker === 0xda) return 1;
    offset += 2 + size;
  }
  return 1;
}
