// Looks inside a JPG for hidden "EXIF" data (camera name, date taken, GPS place). Returns { hasExif, hasGps, camera, taken }.
export function readExif(bytes) {
  const none = { hasExif: false, hasGps: false, camera: '', taken: '' };
  if (bytes.length < 12 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return none;
  let at = 2;
  while (at + 4 < bytes.length && bytes[at] === 0xff) {
    const marker = bytes[at + 1];
    const length = (bytes[at + 2] << 8) | bytes[at + 3];
    if (marker === 0xe1 && String.fromCharCode(...bytes.slice(at + 4, at + 8)) === 'Exif') return parseTiff(bytes.subarray(at + 10, at + 2 + length));
    if (marker === 0xda || length < 2) break;
    at += 2 + length;
  }
  return none;
}

function parseTiff(tiff) {
  const result = { hasExif: true, hasGps: false, camera: '', taken: '' };
  if (tiff.length < 8) return result;
  const little = tiff[0] === 0x49;
  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const u16 = (o) => (o + 2 <= tiff.length ? view.getUint16(o, little) : 0);
  const u32 = (o) => (o + 4 <= tiff.length ? view.getUint32(o, little) : 0);
  const text = (entry) => {
    const count = u32(entry + 4);
    const start = count > 4 ? u32(entry + 8) : entry + 8;
    return String.fromCharCode(...tiff.slice(start, start + Math.max(0, count - 1))).trim();
  };
  const entries = (ifd) => {
    const list = [];
    const n = Math.min(u16(ifd), 200);
    for (let i = 0; i < n; i += 1) list.push({ tag: u16(ifd + 2 + i * 12), at: ifd + 2 + i * 12 });
    return list;
  };
  let exifIfd = 0;
  let make = '';
  let model = '';
  for (const { tag, at } of entries(u32(4))) {
    if (tag === 0x8825) result.hasGps = true;
    else if (tag === 0x8769) exifIfd = u32(at + 8);
    else if (tag === 0x010f) make = text(at);
    else if (tag === 0x0110) model = text(at);
  }
  if (exifIfd) for (const { tag, at } of entries(exifIfd)) if (tag === 0x9003) result.taken = text(at);
  result.camera = [make, model].filter(Boolean).join(' ');
  return result;
}
