// Tests for working out a picture's new size.
import { describe, expect, it } from 'vitest';
import { resizeDims } from './resizeDims.js';

describe('resizeDims', () => {
  it('scales by percent', () => {
    expect(resizeDims(1000, 500, { mode: 'percent', percent: 50 })).toEqual({ width: 500, height: 250 });
  });
  it('keeps the shape when one side is given', () => {
    expect(resizeDims(1000, 500, { mode: 'width', newWidth: 200 })).toEqual({ width: 200, height: 100 });
    expect(resizeDims(1000, 500, { mode: 'height', newHeight: 100 })).toEqual({ width: 200, height: 100 });
  });
  it('uses both sides when exact', () => {
    expect(resizeDims(1000, 500, { mode: 'exact', newWidth: 300, newHeight: 300 })).toEqual({ width: 300, height: 300 });
  });
  it('never gives less than 1 pixel and ignores empty input', () => {
    expect(resizeDims(10, 10, { mode: 'percent', percent: 1 })).toEqual({ width: 1, height: 1 });
    expect(resizeDims(100, 50, { mode: 'width', newWidth: 0 })).toEqual({ width: 100, height: 50 });
  });
});
