// Cuts a piece out of decoded sound and writes it as a WAV file (16-bit, same channels and speed).
// channels: array of Float32Array (one per channel). Returns a Uint8Array.
export function sliceChannels(channels, sampleRate, startSec, endSec) {
  const length = channels[0].length;
  const from = Math.max(0, Math.min(length, Math.round(startSec * sampleRate)));
  const to = Math.max(from, Math.min(length, Math.round(endSec * sampleRate)));
  return channels.map((c) => c.subarray(from, to));
}

export function encodeWav(channels, sampleRate) {
  const count = channels.length;
  const frames = channels[0].length;
  const dataSize = frames * count * 2;
  const out = new DataView(new ArrayBuffer(44 + dataSize));
  const text = (offset, s) => [...s].forEach((ch, i) => out.setUint8(offset + i, ch.charCodeAt(0)));
  text(0, 'RIFF');
  out.setUint32(4, 36 + dataSize, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true);
  out.setUint16(22, count, true);
  out.setUint32(24, sampleRate, true);
  out.setUint32(28, sampleRate * count * 2, true);
  out.setUint16(32, count * 2, true);
  out.setUint16(34, 16, true);
  text(36, 'data');
  out.setUint32(40, dataSize, true);
  let pos = 44;
  for (let i = 0; i < frames; i += 1) {
    for (let c = 0; c < count; c += 1) {
      const v = Math.max(-1, Math.min(1, channels[c][i]));
      out.setInt16(pos, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      pos += 2;
    }
  }
  return new Uint8Array(out.buffer);
}

// Biggest piece we will make (minutes), so the browser does not run out of memory.
export const MAX_MINUTES = 15;
