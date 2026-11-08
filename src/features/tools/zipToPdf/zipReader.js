// Reads the pictures out of a zip file using the browser's own unzip. Guards against zip bombs.
const MAX_ENTRIES = 5000;
const MAX_IMAGES = 200;
const MAX_ONE = 60 * 1024 * 1024;
const MAX_TOTAL = 400 * 1024 * 1024;

function fail(errorKey) {
  return Object.assign(new Error(errorKey), { errorKey });
}

export function unzipSupported() {
  try {
    return typeof DecompressionStream === 'function' && Boolean(new DecompressionStream('deflate-raw'));
  } catch {
    return false;
  }
}

async function inflate(data, limit) {
  const reader = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw fail('error.zipBad');
      chunks.push(value);
    }
  } catch (error) {
    reader.cancel().catch(() => {});
    throw error.errorKey ? error : fail('error.zipBad');
  }
  const out = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}

function listEntries(bytes, view) {
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw fail('error.zipBad');
  const count = view.getUint16(eocd + 10, true);
  let at = view.getUint32(eocd + 16, true);
  if (count === 0xffff || at === 0xffffffff) throw fail('error.zipBad');
  if (count > MAX_ENTRIES) throw fail('error.zipBad');

  const entries = [];
  const utf8 = new TextDecoder('utf-8');
  for (let n = 0; n < count; n += 1) {
    if (at + 46 > bytes.length || view.getUint32(at, true) !== 0x02014b50) throw fail('error.zipBad');
    const nameLength = view.getUint16(at + 28, true);
    entries.push({
      flags: view.getUint16(at + 8, true),
      method: view.getUint16(at + 10, true),
      packed: view.getUint32(at + 20, true),
      size: view.getUint32(at + 24, true),
      offset: view.getUint32(at + 42, true),
      name: utf8.decode(bytes.subarray(at + 46, at + 46 + nameLength)),
    });
    at += 46 + nameLength + view.getUint16(at + 30, true) + view.getUint16(at + 32, true);
  }
  return entries;
}

const isPicture = (name) => {
  const base = name.split('/').pop();
  return !name.startsWith('__MACOSX/') && !base.startsWith('.') && /\.(jpe?g|png)$/i.test(base);
};

// Returns { images: [{ name, bytes }] in natural name order, skipped: number of other files }.
export async function readZipImages(bytes) {
  if (!unzipSupported()) throw fail('error.zipUnsupported');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const all = listEntries(bytes, view).filter((entry) => !entry.name.endsWith('/'));
  const pictures = all.filter((entry) => isPicture(entry.name));
  if (pictures.length === 0) throw fail('error.zipEmpty');
  if (pictures.length > MAX_IMAGES) throw fail('error.tooMany');
  if (pictures.some((entry) => entry.flags & 1)) throw fail('error.password');

  pictures.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  const images = [];
  let total = 0;
  for (const entry of pictures) {
    const start = entry.offset;
    if (start + 30 > bytes.length || view.getUint32(start, true) !== 0x04034b50) throw fail('error.zipBad');
    const dataStart = start + 30 + view.getUint16(start + 26, true) + view.getUint16(start + 28, true);
    const packed = bytes.subarray(dataStart, dataStart + entry.packed);
    if (entry.size > MAX_ONE || packed.length !== entry.packed) throw fail('error.zipBad');
    total += entry.size;
    if (total > MAX_TOTAL) throw fail('error.tooBig');
    let data;
    if (entry.method === 0) data = packed;
    else if (entry.method === 8) data = await inflate(packed, entry.size + 1024);
    else throw fail('error.zipBad');
    images.push({ name: entry.name, bytes: data });
  }
  return { images, skipped: all.length - pictures.length };
}
