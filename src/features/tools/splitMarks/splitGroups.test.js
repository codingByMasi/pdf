// Tests for grouping pages when splitting at bookmarks or blank pages.
import { describe, expect, it } from 'vitest';
import { groupsFromBlanks, groupsFromStarts } from './splitGroups.js';

describe('groupsFromStarts', () => {
  it('cuts at each start and keeps the first part even if the first bookmark is later', () => {
    expect(groupsFromStarts([2, 4], 6)).toEqual([[0, 1], [2, 3], [4, 5]]);
  });
  it('ignores repeats and out-of-range starts', () => {
    expect(groupsFromStarts([0, 3, 3, 99], 5)).toEqual([[0, 1, 2], [3, 4]]);
  });
});

describe('groupsFromBlanks', () => {
  it('drops blank pages and splits there', () => {
    expect(groupsFromBlanks([2, 5], 7)).toEqual([[0, 1], [3, 4], [6]]);
  });
  it('gives one part when nothing is blank', () => {
    expect(groupsFromBlanks([], 3)).toEqual([[0, 1, 2]]);
  });
  it('gives nothing when everything is blank', () => {
    expect(groupsFromBlanks([0, 1], 2)).toEqual([]);
  });
});
