// GIF-style LZW compression of palette indexes. Returns the packed bytes (without the block lengths).
export function lzwEncode(indexes, minCodeSize) {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  const out = [];
  let bits = 0;
  let nbits = 0;
  let size = minCodeSize + 1;
  const put = (code) => {
    bits |= code << nbits;
    nbits += size;
    while (nbits >= 8) { out.push(bits & 255); bits >>>= 8; nbits -= 8; }
  };
  let dict = new Map();
  let next = end + 1;
  put(clear);
  let prefix = indexes[0];
  for (let i = 1; i < indexes.length; i += 1) {
    const k = indexes[i];
    const key = prefix * 4096 + k;
    const hit = dict.get(key);
    if (hit !== undefined) {
      prefix = hit;
    } else {
      put(prefix);
      if (next < 4096) {
        dict.set(key, next);
        if (next === (1 << size) && size < 12) size += 1;
        next += 1;
      } else {
        put(clear);
        dict = new Map();
        next = end + 1;
        size = minCodeSize + 1;
      }
      prefix = k;
    }
  }
  put(prefix);
  put(end);
  if (nbits > 0) out.push(bits & 255);
  return out;
}
