// @vitest-environment happy-dom
// Tests that the HTML reader keeps only safe, plain content.
import { describe, expect, it } from 'vitest';
import { htmlToBlocks } from './htmlBlocks.js';

const text = (block) => block.runs.map((run) => run.text).join('');

describe('htmlToBlocks', () => {
  it('keeps headings, paragraphs, bold text and breaks', () => {
    const { blocks } = htmlToBlocks('<h2>Hi</h2><p>One <b>two</b><br>three</p>');
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 });
    expect(text(blocks[1])).toBe('One two\nthree');
    expect(blocks[1].runs[1].bold).toBe(true);
  });

  it('drops scripts, styles, frames, forms and their content', () => {
    const { blocks } = htmlToBlocks(
      '<script>alert(1)</script><style>p{color:red}</style><form><input value="secret"></form><p onclick="x()">ok</p>',
    );
    expect(blocks).toHaveLength(1);
    expect(text(blocks[0])).toBe('ok');
  });

  it('counts pictures it leaves out and never keeps links', () => {
    const { blocks, skippedImages } = htmlToBlocks('<p>See <a href="http://evil.test/x">this</a><img src="http://evil.test/a.png"></p>');
    expect(skippedImages).toBe(1);
    expect(JSON.stringify(blocks)).not.toContain('evil.test');
  });

  it('reads lists and tables', () => {
    const { blocks } = htmlToBlocks('<ul><li>a<ul><li>b</li></ul></li></ul><ol><li>x</li></ol><table><tr><th>H</th></tr><tr><td>1</td></tr></table>');
    expect(blocks.filter((b) => b.kind === 'item').map((b) => [b.marker, b.depth, text(b)])).toEqual([
      ['•', 0, 'a'],
      ['•', 1, 'b'],
      ['1.', 0, 'x'],
    ]);
    expect(blocks.at(-1)).toEqual({ kind: 'table', rows: [['H'], ['1']] });
  });

  it('keeps pre text as it is', () => {
    expect(htmlToBlocks('<pre>a  b\n c</pre>').blocks[0]).toEqual({ kind: 'pre', text: 'a  b\n c' });
  });
});
