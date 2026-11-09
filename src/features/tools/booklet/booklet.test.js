// Tests for the booklet page order.
import { describe, expect, it } from 'vitest';
import { bookletSides } from './bookletOrder.js';

describe('bookletSides', () => {
  it('orders 8 pages for folding', () => {
    expect(bookletSides(8)).toEqual([[7, 0], [1, 6], [5, 2], [3, 4]]);
  });
  it('pads to a multiple of 4 with blanks', () => {
    expect(bookletSides(5)).toEqual([[null, 0], [1, null], [null, 2], [3, 4]]);
  });
  it('handles one page', () => {
    expect(bookletSides(1)).toEqual([[null, 0], [null, null]]);
  });
});
