// Tests for text find and replace.
import { describe, expect, it } from 'vitest';
import { replaceText } from './replaceText.js';

describe('replaceText', () => {
  it('replaces every match and counts', () => {
    expect(replaceText('a.b a.b', { find: 'a.b', replace: 'X' })).toEqual({ ok: true, text: 'X X', count: 2 });
  });
  it('can match case and whole words', () => {
    expect(replaceText('Cat cat concat', { find: 'cat', replace: 'dog', matchCase: true, wholeWord: true }).text).toBe('Cat dog concat');
  });
  it('uses patterns with groups', () => {
    expect(replaceText('a1 b2', { find: '([a-z])(\\d)', replace: '$2$1', regex: true }).text).toBe('1a 2b');
  });
  it('reports a broken pattern', () => {
    expect(replaceText('x', { find: '(', regex: true }).ok).toBe(false);
  });
});
