// Colour maths for the palette and gradient tool: hex <-> HSL, matching colours, and the CSS for a gradient.
export function hexToHsl(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (Math.round(h * 60) + 360) % 360, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex({ h, s, l }) {
  const sat = s / 100, lig = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n) => Math.round(255 * (lig - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))).toString(16).padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`;
}

const turn = (hsl, deg) => ({ ...hsl, h: (hsl.h + deg + 360) % 360 });

// Sets of matching colours for a base colour (a hex text). Returns null if the hex is wrong.
export function makePalettes(hex) {
  const base = hexToHsl(hex);
  if (!base) return null;
  const hexes = (list) => list.map(hslToHex);
  return {
    complementary: hexes([base, turn(base, 180)]),
    analogous: hexes([turn(base, -30), base, turn(base, 30)]),
    triadic: hexes([base, turn(base, 120), turn(base, 240)]),
    shades: hexes([15, 30, 45, 60, 75, 90].map((l) => ({ ...base, l }))),
  };
}

// angle in degrees, stops: ['#hex', ...]. Gives one line of CSS.
export function gradientCss(angle, stops) {
  return `background: linear-gradient(${Math.round(angle)}deg, ${stops.join(', ')});`;
}
