// Tests that the catalog is complete: unique ids and addresses, known categories, all texts in both languages.
import { describe, it, expect } from 'vitest';
import { categories, tools, findToolByPath, groupByCategory } from './toolCatalog.js';
import { en } from '../i18n/en.js';
import { hi } from '../i18n/hi.js';

const parts = ['name', 'desc', 'step1', 'step2', 'step3', 'faq1q', 'faq1a', 'faq2q', 'faq2a', 'seoTitle', 'seoDesc'];

describe('toolCatalog', () => {
  it('has unique ids and addresses', () => {
    expect(new Set(tools.map((t) => t.id)).size).toBe(tools.length);
    expect(new Set(tools.map((t) => t.path)).size).toBe(tools.length);
  });
  it('puts every tool in a known category with texts for it', () => {
    for (const category of categories) {
      expect(en[`category.${category}`], category).toBeTruthy();
      expect(hi[`category.${category}`], category).toBeTruthy();
    }
    for (const tool of tools) expect(categories, tool.id).toContain(tool.category);
  });
  it('has all texts for every tool in English and Hindi', () => {
    for (const tool of tools) {
      for (const part of parts) {
        expect(en[`tool.${tool.id}.${part}`], `${tool.id} ${part} (en)`).toBeTruthy();
        expect(hi[`tool.${tool.id}.${part}`], `${tool.id} ${part} (hi)`).toBeTruthy();
      }
    }
  });
  it('finds a tool by its address', () => {
    expect(findToolByPath('/merge-pdf').id).toBe('merge');
    expect(findToolByPath('/nope')).toBeUndefined();
  });
  it('groups tools in category order and skips empty groups', () => {
    const groups = groupByCategory(tools);
    expect(groups[0].category).toBe('organize');
    expect(groups.every((g) => g.tools.length > 0)).toBe(true);
    expect(groupByCategory([])).toEqual([]);
  });
});
