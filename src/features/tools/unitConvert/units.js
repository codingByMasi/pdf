// Unit conversion tables. Each unit has a factor to the group's base unit (temperature is handled separately).
export const GROUPS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, quintal: 100, tonne: 1000, pound: 0.45359237, ounce: 0.028349523125 },
  area: { sqm: 1, sqkm: 1e6, sqft: 0.09290304, sqyard: 0.83612736, acre: 4046.8564224, hectare: 10000 },
  volume: { litre: 1, ml: 0.001, m3: 1000, gallonUs: 3.785411784, cup: 0.2365882365, tablespoon: 0.01478676478 },
  speed: { kmh: 1, ms: 3.6, mph: 1.609344, knot: 1.852 },
  data: { byte: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 },
  temperature: { c: 1, f: 1, k: 1 },
};

export function convertUnit(group, from, to, value) {
  const v = Number(value);
  if (!Number.isFinite(v) || value === '') return null;
  if (group === 'temperature') {
    const celsius = from === 'f' ? ((v - 32) * 5) / 9 : from === 'k' ? v - 273.15 : v;
    return to === 'f' ? (celsius * 9) / 5 + 32 : to === 'k' ? celsius + 273.15 : celsius;
  }
  const table = GROUPS[group];
  return (v * table[from]) / table[to];
}

// Shows a number without long tails or scientific writing for ordinary sizes.
export function niceNumber(n) {
  if (n === null || !Number.isFinite(n)) return '';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-9) return n.toExponential(6);
  return Number(n.toPrecision(10)).toLocaleString('en-US', { maximumFractionDigits: 10, useGrouping: false });
}
