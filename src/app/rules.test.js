// Checks the project rules: file size, first-line comment, and one-way imports.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

const files = listFiles(root).filter((f) => /\.(js|jsx|css)$/.test(f));
const isText = (f) => /shared\/i18n\/(en|hi)\.js$/.test(f);
const rel = (f) => relative(root, f);

describe('project rules', () => {
  it('keeps every file under 200 lines (text files excepted)', () => {
    for (const f of files.filter((f) => !isText(f))) {
      expect(readFileSync(f, 'utf8').split('\n').length, rel(f)).toBeLessThan(200);
    }
  });
  it('starts every file with a one-line comment', () => {
    for (const f of files) {
      const first = readFileSync(f, 'utf8').split('\n')[0].trim();
      expect(/^(\/\/|\/\*)/.test(first), rel(f)).toBe(true);
    }
  });
  it('never lets shared code import from features', () => {
    for (const f of files.filter((f) => rel(f).startsWith('shared/'))) {
      expect(/from\s+['"][^'"]*features\//.test(readFileSync(f, 'utf8')), rel(f)).toBe(false);
    }
  });
  it('uses camelCase for .js files and PascalCase for .jsx files', () => {
    for (const f of files) {
      const name = f.split('/').pop();
      if (name.endsWith('.jsx')) expect(/^[A-Z][A-Za-z0-9]*\.jsx$/.test(name) || name === 'main.jsx', name).toBe(true);
      if (name.endsWith('.js')) expect(/^[a-z][A-Za-z0-9]*(\.test)?\.js$/.test(name), name).toBe(true);
    }
  });
});
