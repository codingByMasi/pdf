// Tests that every tool is complete and has all its texts in English and Hindi.
import { describe, it, expect } from 'vitest';
import { tools, findToolByPath } from './toolList.js';
import { toolScreens } from './toolRegistry.js';
import { en } from '../../shared/i18n/en.js';
import { hi } from '../../shared/i18n/hi.js';

const parts = ['name', 'desc', 'step1', 'step2', 'step3', 'faq1q', 'faq1a', 'faq2q', 'faq2a'];

describe('toolList', () => {
  it('has 8 tools with unique ids and paths', () => {
    expect(tools).toHaveLength(8);
    expect(new Set(tools.map((t) => t.id)).size).toBe(8);
    expect(new Set(tools.map((t) => t.path)).size).toBe(8);
  });
  it('has all texts for every tool', () => {
    for (const tool of tools) {
      for (const part of parts) {
        expect(en[`tool.${tool.id}.${part}`], `${tool.id} ${part} (en)`).toBeTruthy();
        expect(hi[`tool.${tool.id}.${part}`], `${tool.id} ${part} (hi)`).toBeTruthy();
      }
    }
  });
  it('has a screen for every tool', () => {
    for (const tool of tools) expect(toolScreens[tool.id], tool.id).toBeDefined();
  });
  it('finds a tool by its address', () => {
    expect(findToolByPath('/merge-pdf').id).toBe('merge');
    expect(findToolByPath('/nope')).toBeUndefined();
  });
});
