// Tests the Markdown reader with English and Hindi text.
import { describe, it, expect } from 'vitest';
import { markdownToBlocks } from './markdownBlocks.js';

const kinds = (md) => markdownToBlocks(md).blocks.map((b) => b.kind);

describe('markdownToBlocks', () => {
  it('reads headings, paragraphs, lists and rules', () => {
    expect(kinds('# Title\n\nSome text\nmore text\n\n- one\n- two\n\n1. a\n\n---')).toEqual(['heading', 'para', 'item', 'item', 'item', 'rule']);
  });
  it('joins lines of one paragraph and keeps bold', () => {
    const [block] = markdownToBlocks('Hello **world**\nagain').blocks;
    expect(block.runs).toEqual([{ text: 'Hello ', bold: false }, { text: 'world', bold: true }, { text: ' again', bold: false }]);
  });
  it('reads code blocks, quotes and tables', () => {
    const { blocks } = markdownToBlocks('```\nx = 1\n```\n\n> quoted\n\n| a | b |\n|---|---|\n| 1 | 2 |');
    expect(blocks[0]).toEqual({ kind: 'pre', text: 'x = 1' });
    expect(blocks[1].quote).toBe(true);
    expect(blocks[2].rows).toEqual([['a', 'b'], ['1', '2']]);
  });
  it('shows link addresses, counts pictures and handles Hindi', () => {
    const { blocks, skippedImages } = markdownToBlocks('## नमस्ते\n\n[site](https://a.b) ![pic](x.png)');
    expect(blocks[0].runs[0].text).toBe('नमस्ते');
    expect(blocks[1].runs.map((r) => r.text).join('')).toContain('site (https://a.b)');
    expect(skippedImages).toBe(1);
  });
  it('indents nested list items', () => {
    expect(markdownToBlocks('- a\n  - b').blocks[1].depth).toBe(1);
  });
});
