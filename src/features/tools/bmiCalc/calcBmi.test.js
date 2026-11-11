// Tests the BMI numbers and groups.
import { describe, it, expect } from 'vitest';
import { calcBmi } from './calcBmi.js';

describe('calcBmi', () => {
  it('works in kilos and centimetres', () => {
    const r = calcBmi({ height: 170, weight: 65 });
    expect(r.bmi).toBeCloseTo(22.49, 1);
    expect(r.group).toBe('normal');
  });
  it('works in pounds and inches', () => {
    expect(calcBmi({ height: 70, weight: 154, unit: 'imperial' }).bmi).toBeCloseTo(22.1, 1);
  });
  it('finds the groups', () => {
    expect(calcBmi({ height: 170, weight: 50 }).group).toBe('under');
    expect(calcBmi({ height: 170, weight: 80 }).group).toBe('over');
    expect(calcBmi({ height: 170, weight: 95 }).group).toBe('obese');
  });
  it('refuses silly numbers', () => {
    expect(calcBmi({ height: 0, weight: 60 }).ok).toBe(false);
    expect(calcBmi({ height: 17, weight: 60 }).errorKey).toBe('bmi.range');
  });
});
