// Tests for the JSON formatter.
import { describe, expect, it } from 'vitest';
import { formatJson, formatSorted } from './jsonFormat.js';

describe('formatJson', () => {
  it('tidies and shrinks', () => {
    expect(formatJson('{"a":1,"b":[1,2]}', 2).text).toBe('{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}');
    expect(formatJson('{ "a" : 1 }', 0).text).toBe('{"a":1}');
  });
  it('reports where a mistake is', () => {
    const r = formatJson('{\n  "a": 1,\n  "b": \n}', 2);
    expect(r.ok).toBe(false);
    expect(r.line).toBeGreaterThanOrEqual(1);
  });
  it('points at the end when the text stops early', () => {
    expect(formatJson('{"b":', 2)).toMatchObject({ ok: false, line: 1, column: 6 });
  });
  it('sorts keys', () => {
    expect(formatSorted('{"b":1,"a":{"d":1,"c":2}}', 0).text).toBe('{"a":{"c":2,"d":1},"b":1}');
  });
});
