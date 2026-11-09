// Tests the duplicate-pages plan.
import { describe, it, expect } from 'vitest';
import { duplicatePlan } from './duplicatePlan.js';

describe('duplicatePlan', () => {
  it('repeats chosen pages right after themselves', () => {
    expect(duplicatePlan(3, [1], 2).map((p) => p.index)).toEqual([0, 1, 1, 1, 2]);
  });
  it('keeps other pages once', () => {
    expect(duplicatePlan(2, [], 3).map((p) => p.index)).toEqual([0, 1]);
  });
});
