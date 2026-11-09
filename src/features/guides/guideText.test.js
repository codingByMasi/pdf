// Checks that both languages have the same guides, with the same number of steps and tips.
import { describe, it, expect } from 'vitest';
import { guides } from './guideList.js';
import { guideTextEn } from './guideTextEn.js';
import { guideTextHi } from './guideTextHi.js';
import { tools } from '../../shared/lib/toolCatalog.js';

describe('guides', () => {
  it('has words in both languages for every guide', () => {
    expect(Object.keys(guideTextEn).sort()).toEqual(guides.map((g) => g.slug).sort());
    expect(Object.keys(guideTextHi).sort()).toEqual(Object.keys(guideTextEn).sort());
  });
  it('keeps the same number of steps and tips in Hindi', () => {
    for (const slug of Object.keys(guideTextEn)) {
      expect(guideTextHi[slug].steps.length, slug).toBe(guideTextEn[slug].steps.length);
      expect(guideTextHi[slug].tips.length, slug).toBe(guideTextEn[slug].tips.length);
      expect(guideTextHi[slug].desc.length, slug).toBeGreaterThanOrEqual(40);
      expect(guideTextHi[slug].desc.length, slug).toBeLessThanOrEqual(160);
      expect(guideTextEn[slug].desc.length, slug).toBeGreaterThanOrEqual(40);
      expect(guideTextEn[slug].desc.length, slug).toBeLessThanOrEqual(160);
    }
  });
  it('points every guide to a real tool', () => {
    for (const g of guides) expect(tools.some((t) => t.id === g.tool), g.slug).toBe(true);
  });
});
