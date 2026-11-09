// Tests for the word counter.
import { describe, expect, it } from 'vitest';
import { countText } from './countText.js';

describe('countText', () => {
  it('counts English', () => {
    const c = countText('Hello world. How are you?\n\nSecond paragraph!');
    expect(c).toMatchObject({ words: 7, sentences: 3, paragraphs: 2 });
  });
  it('counts Hindi words and full stops', () => {
    expect(countText('मेरा नाम आशा है। आप कैसे हैं।')).toMatchObject({ words: 7, sentences: 2 });
  });
  it('counts nothing for empty text', () => {
    expect(countText('')).toMatchObject({ words: 0, characters: 0, sentences: 0, readMinutes: 0 });
  });
  it('counts emoji as one character', () => expect(countText('a😀').characters).toBe(2));
});
