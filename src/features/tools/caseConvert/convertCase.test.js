// Tests for the case converter.
import { describe, expect, it } from 'vitest';
import { convertCase } from './convertCase.js';

describe('convertCase', () => {
  it('does upper and lower', () => {
    expect(convertCase('upper', 'Hello')).toBe('HELLO');
    expect(convertCase('lower', 'Hello')).toBe('hello');
  });
  it('does title and sentence case', () => {
    expect(convertCase('title', 'the quick BROWN fox')).toBe('The Quick Brown Fox');
    expect(convertCase('sentence', 'hello there. how ARE you? fine')).toBe('Hello there. How are you? Fine');
  });
  it('does code styles', () => {
    expect(convertCase('camel', 'my cool name')).toBe('myCoolName');
    expect(convertCase('snake', 'myCoolName here')).toBe('my_cool_name_here');
    expect(convertCase('kebab', 'My Cool  Name')).toBe('my-cool-name');
  });
  it('leaves Hindi alone', () => expect(convertCase('upper', 'नमस्ते')).toBe('नमस्ते'));
});
