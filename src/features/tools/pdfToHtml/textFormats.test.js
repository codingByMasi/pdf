// Tests the HTML and Markdown output, including unsafe characters.
import { describe, it, expect } from 'vitest';
import { pagesToHtml, pagesToMarkdown } from './textFormats.js';

describe('textFormats', () => {
  it('escapes HTML so file text can never become page code', () => {
    const html = pagesToHtml(['<script>alert(1)</script> & "x"'], 'a<b', 'Page');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<title>a&lt;b</title>');
  });
  it('writes one section per page', () => {
    expect(pagesToHtml(['a\nb', 'c'], 't', 'Page').match(/<section>/g)).toHaveLength(2);
  });
  it('escapes Markdown marks and keeps Hindi', () => {
    const md = pagesToMarkdown(['# not a heading\n*x*\nनमस्ते'], 'Page');
    expect(md).toContain('\\# not a heading');
    expect(md).toContain('\\*x\\*');
    expect(md).toContain('नमस्ते');
  });
});
