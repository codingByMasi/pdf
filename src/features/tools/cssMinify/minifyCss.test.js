// Tests the CSS minifier on comments, spaces, strings and urls.
import { describe, it, expect } from 'vitest';
import { minifyCss } from './minifyCss.js';

describe('minifyCss', () => {
  it('removes comments, spaces and the last semicolon', () => {
    expect(minifyCss('/* hi */\na {\n  color : red;\n  margin: 0 auto;\n}\n')).toBe('a{color:red;margin:0 auto}');
  });
  it('keeps strings and urls as they are', () => {
    expect(minifyCss('a::after { content: "a  b;  c"; background: url( "x y.png" ) }')).toBe('a::after{content:"a  b;  c";background:url( "x y.png" )}');
  });
  it('keeps spaces inside values and calc', () => {
    expect(minifyCss('a { width: calc(100% - 10px); font: 12px / 1.5 Arial, sans-serif }')).toBe('a{width:calc(100% - 10px);font:12px / 1.5 Arial,sans-serif}');
  });
  it('is shorter', () => {
    const css = 'body {\n  margin: 0;\n}\n';
    expect(minifyCss(css).length).toBeLessThan(css.length);
  });
});
