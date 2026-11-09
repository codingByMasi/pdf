// Tests for the WAV writer and the cutter.
import { describe, expect, it } from 'vitest';
import { encodeWav, sliceChannels } from './wavEncode.js';

describe('wav', () => {
  it('writes a correct header and samples', () => {
    const wav = encodeWav([Float32Array.from([0, 1, -1, 0.5])], 8000);
    const v = new DataView(wav.buffer);
    expect(String.fromCharCode(...wav.slice(0, 4))).toBe('RIFF');
    expect(v.getUint32(24, true)).toBe(8000);
    expect(v.getUint16(22, true)).toBe(1);
    expect(v.getUint32(40, true)).toBe(8);
    expect(v.getInt16(46, true)).toBe(32767);
    expect(v.getInt16(48, true)).toBe(-32768);
    expect(wav.length).toBe(52);
  });
  it('interleaves two channels', () => {
    const wav = encodeWav([Float32Array.from([1]), Float32Array.from([-1])], 44100);
    const v = new DataView(wav.buffer);
    expect(v.getInt16(44, true)).toBe(32767);
    expect(v.getInt16(46, true)).toBe(-32768);
  });
  it('cuts by seconds and stays in range', () => {
    const c = [new Float32Array(100)];
    expect(sliceChannels(c, 10, 2, 5)[0]).toHaveLength(30);
    expect(sliceChannels(c, 10, -3, 999)[0]).toHaveLength(100);
    expect(sliceChannels(c, 10, 8, 3)[0]).toHaveLength(0);
  });
});
