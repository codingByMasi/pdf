// Checks that every tool in the catalog has an icon picture.
import { describe, it, expect } from 'vitest';
import { tools } from '../lib/toolCatalog.js';
import { iconNames } from './Icon.jsx';

describe('icons', () => {
  it('has a picture for every tool icon name', () => {
    for (const tool of tools) expect(iconNames, tool.id).toContain(tool.icon);
  });
});
