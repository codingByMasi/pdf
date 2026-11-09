// Turns text into the data and error-correction codewords of a QR code (byte mode, versions 1 to 10).
import { ecCodewords } from './reedSolomon.js';
import { BLOCKS, LEVELS, MAX_VERSION } from './qrTables.js';

const blockList = (version, level) => {
  const [ec, ...groups] = BLOCKS[version - 1][LEVELS.indexOf(level)];
  return { ec, blocks: groups.flatMap(([count, size]) => new Array(count).fill(size)) };
};

// Finds the smallest version that fits, or throws an error with errorKey 'error.qrTooLong'.
export function pickVersion(byteCount, level) {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    const { blocks } = blockList(version, level);
    const capacity = blocks.reduce((a, b) => a + b, 0);
    const header = version < 10 ? 2 : 3;
    if (byteCount + header <= capacity) return version;
  }
  throw Object.assign(new Error('too long'), { errorKey: 'error.qrTooLong' });
}

export function buildCodewords(text, level) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const version = pickVersion(bytes.length, level);
  const { ec, blocks } = blockList(version, level);
  const capacity = blocks.reduce((a, b) => a + b, 0);

  const bits = [];
  const push = (value, length) => { for (let i = length - 1; i >= 0; i -= 1) bits.push((value >> i) & 1); };
  push(4, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, capacity * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  for (let pad = 0; data.length < capacity; pad += 1) data.push(pad % 2 === 0 ? 0xec : 0x11);

  let start = 0;
  const dataBlocks = blocks.map((size) => data.slice(start, (start += size)));
  const ecBlocks = dataBlocks.map((block) => ecCodewords(block, ec));
  const out = [];
  const longest = Math.max(...blocks);
  for (let i = 0; i < longest; i += 1) dataBlocks.forEach((b) => { if (i < b.length) out.push(b[i]); });
  for (let i = 0; i < ec; i += 1) ecBlocks.forEach((b) => out.push(b[i]));
  return { version, codewords: out };
}
