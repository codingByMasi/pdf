// Tests typing speed numbers.
import { describe, it, expect } from 'vitest';
import { letterStates, typingStats } from './typingStats.js';

describe('typingStats', () => {
  it('counts 5 right letters in 6 seconds as 10 words per minute', () => {
    expect(typingStats('hello world', 'hello', 6)).toMatchObject({ wpm: 10, accuracy: 100 });
  });
  it('lowers accuracy for mistakes', () => {
    expect(typingStats('abcd', 'abxd', 10).accuracy).toBe(75);
  });
  it('marks letters', () => {
    expect(letterStates('abc', 'ax')).toEqual(['ok', 'bad', 'todo']);
  });
});
