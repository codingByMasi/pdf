// Tests that every tool in the catalog has a screen.
import { describe, it, expect } from 'vitest';
import { tools } from '../../shared/lib/toolCatalog.js';
import { toolScreens } from './toolRegistry.js';

describe('toolRegistry', () => {
  it('has a screen for every tool, and no extra screens', () => {
    for (const tool of tools) expect(toolScreens[tool.id], tool.id).toBeDefined();
    expect(Object.keys(toolScreens).sort()).toEqual(tools.map((t) => t.id).sort());
  });
});
