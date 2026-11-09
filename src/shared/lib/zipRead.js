// Opens zip files in the browser: lists the files inside and unpacks the ones you ask for. Guards against zip bombs.
const MAX_ENTRIES = 5000;

function fail(errorKey) {
  return Object.assign(new Error(errorKey), { errorKey });
}
export { fail as zipFail };

export function unzipSupported() {
  try {
    return typeof DecompressionStream === 'function' && Boolean(new DecompressionStream('deflate-raw'));
  } catch {
    return false;
  }
}

// Unpacks deflate data with the browser's own tool, or with pako in older browsers.
async function inflate(data, limit) {
  if (!unzipSupported()) {
    const pako = (await import('pako')).default;
    let out;
    try {
      out = pako.inflateRaw(data);
    } catch {
      throw fail('error.zipBad');
    }
    if (out.length > limit) throw fail('error.zipBad');
    return out;
  }
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

export function listEntries(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
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
  if (count === 0xffff || at === 0xffffffff || count > MAX_ENTRIES) throw fail('error.zipBad');

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

// Unpacks the given entries (from listEntries). limits: { one, total } in bytes. Returns [{ name, bytes }] in the same order.
export async function unpackEntries(bytes, entries, { one = 60 * 1024 * 1024, total = 400 * 1024 * 1024 } = {}) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (entries.some((entry) => entry.flags & 1)) throw fail('error.password');
  const out = [];
  let sum = 0;
  for (const entry of entries) {
    const start = entry.offset;
    if (start + 30 > bytes.length || view.getUint32(start, true) !== 0x04034b50) throw fail('error.zipBad');
    const dataStart = start + 30 + view.getUint16(start + 26, true) + view.getUint16(start + 28, true);
    const packed = bytes.subarray(dataStart, dataStart + entry.packed);
    if (entry.size > one || packed.length !== entry.packed) throw fail('error.zipBad');
    sum += entry.size;
    if (sum > total) throw fail('error.tooBig');
    let data;
    if (entry.method === 0) data = packed;
    else if (entry.method === 8) data = await inflate(packed, entry.size + 1024);
    else throw fail('error.zipBad');
    out.push({ name: entry.name, bytes: data });
  }
  return out;
}
