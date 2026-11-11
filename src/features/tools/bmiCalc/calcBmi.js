// Body mass index from height and weight, with the usual adult groups. A rough guide only.
export const GROUPS = ['under', 'normal', 'over', 'obese'];

// unit: 'metric' (height cm, weight kg) or 'imperial' (height in feet+inches in `height` as total inches, weight in pounds).
export function calcBmi({ height, weight, unit = 'metric' }) {
  const h = Number(height);
  const w = Number(weight);
  if (!(h > 0) || !(w > 0)) return { ok: false };
  const metres = unit === 'imperial' ? h * 0.0254 : h / 100;
  const kilos = unit === 'imperial' ? w * 0.45359237 : w;
  if (metres < 0.5 || metres > 2.6 || kilos < 2 || kilos > 700) return { ok: false, errorKey: 'bmi.range' };
  const bmi = kilos / (metres * metres);
  const group = bmi < 18.5 ? 'under' : bmi < 25 ? 'normal' : bmi < 30 ? 'over' : 'obese';
  // Weight range that keeps BMI between 18.5 and 24.9 at this height, in kilos.
  return { ok: true, bmi, group, healthyLow: 18.5 * metres * metres, healthyHigh: 24.9 * metres * metres };
}
